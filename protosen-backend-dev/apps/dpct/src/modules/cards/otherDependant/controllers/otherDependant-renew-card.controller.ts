import { Request, Response } from 'express';
import { HttpStatusCode } from 'axios';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '@constants/messages';
import { getDateThreeYearsFromNow } from '@shared/utils/functions';
import { EDocumentState, ESuperAdminDocumentState } from '@modules/cards/types';
import { RoleEnum } from '@modules/user/types';
import { SharedDCService } from '@shared/services/sharedDC.service';
import {
	AdminValidateDocumentInput,
	GetByCardNumberInput,
	GetByIdInput,
	SuperAdminValidateDocumentInput,
} from '@shared/schemas/public.schemas';
import { RenewOtherDependantDCService } from '../services/otherDependant-renew.service';
import { OtherDependantDCService } from '../services/otherDependant-card.service';
import { GetOtherDependantsDCInput } from '../dtos/otherDependant-card.dto';
import { UsersService } from '@modules/user/services/user.service';
import { AUTH_MESSAGES } from '../../../../constants/messages/auth.messages';
import authorizationService from '@shared/services/authorization.service';
import SharedDCController from '@shared/controllers/sharedDC.controller';

const applicant = 'Autre dépendants';

class RenewOtherDependantDCController {
	async getOtherDependantCard(req: Request<GetByIdInput>, res: Response) {
		try {
			const { id } = req.params;
			const userAuth = res.locals.userAuth;

			const card = await authorizationService.getAuthorizedResource(
				new RenewOtherDependantDCService(),
				id,
				userAuth,
			);

			if (!card) {
				return res.status(HttpStatusCode.NotFound).json({
					message: ERROR_MESSAGE.NOT_FOUND_MESSAGE,
				});
			}

			return res.status(HttpStatusCode.Ok).json({
				data: card,
			});
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message,
				details: error.details,
			});
		}
	}

	async createRenewal(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const user = res.locals.user;

			const currentUser = await new UsersService().getUserById(user.id);

			if (!currentUser) {
				return res.status(HttpStatusCode.NotFound).json({
					message: AUTH_MESSAGES.ACCOUNT_NOT_FOUND,
				});
			}
			const cardToRenew = await new OtherDependantDCService().getById(id);
			if (!cardToRenew) {
				return res.status(HttpStatusCode.NotFound).json({
					message: ERROR_MESSAGE.NOT_FOUND_MESSAGE,
				});
			}

			// Sécurité : on ne peut pas renouveler une carte qui a déjà été renouvelée deux fois
			if ((cardToRenew.renewals?.length || 0) >= 2) {
				return res.status(HttpStatusCode.UnprocessableEntity).json({
					message: ERROR_MESSAGE.CAN_NOT_UPDATE,
					error: 'Nombre maximal de renouvellements atteint pour cette carte.',
				});
			}

			if (!cardToRenew.cardNumber) {
				return res.status(HttpStatusCode.BadRequest).json({
					message: 'Numéro de carte requis pour le renouvellement',
				});
			}

			const payload = {
				previousCardId: cardToRenew.id,
				cardNumber: cardToRenew.cardNumber, // On garde le même numéro de carte
				creatorId: currentUser.id,
				organismId: currentUser.organismId,
			};

			const newOwnerCard = await new RenewOtherDependantDCService().save(payload);

			return res.status(HttpStatusCode.Ok).json({
				message: SUCCESS_MESSAGE.CREATION_SUCCESS_MESSAGE,
				data: newOwnerCard,
			});
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message,
			});
		}
	}

	async getOtherDependantsDC(req: Request<{}, {}, {}, GetOtherDependantsDCInput>, res: Response) {
		try {
			const {
				status,
				search,
				page,
				limit,
				sort,
				documentStage,
				expired,
				ownerCardId,
				id,
				creatorId,
				organismId,
			} = req.query;
			const userAuth = res.locals.userAuth;

			const queryOptions = {
				status: status,
				search: search,
				page: page,
				limit: limit,
				sort: sort,
				ownerCardId,
				documentStage: documentStage,
				expired: expired,
				id: id,
			};

			const queryOptionsUser = {
				...queryOptions,
				creatorId: userAuth.id,
				organismId: userAuth.organismId,
			};

			const queryOptionsAdmin = {
				...queryOptions,
				organismId: organismId,
				creatorId: creatorId,
			};
			const response = await new RenewOtherDependantDCService().getEntities(
				userAuth.role === RoleEnum.SUPERADMIN || userAuth.role === RoleEnum.ADMIN
					? queryOptionsAdmin
					: queryOptionsUser,
			);
			return res.status(HttpStatusCode.Ok).json({
				message: SUCCESS_MESSAGE.FETCH_SUCCESS_MESSAGE,
				data: response,
			});
		} catch (error: any) {
			console.error(error);
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message,
				details: error.details,
			});
		}
	}

	async pointFocalValidation(req: Request<GetByIdInput>, res: Response) {
		try {
			const { id } = req.params;

			const currentUser = res.locals.userAuth;

			const card = await new RenewOtherDependantDCService().getOne({
				id: id,
				organismId: currentUser.organismId,
				creatorId: currentUser.id,
			});
			if (!card)
				{return res.status(HttpStatusCode.NotFound).json({ message: 'Carte non trouvable' });}

			if (
				(card.dataValues.documentStage === EDocumentState.APPROVED && !card.expired) ||
				(card.dataValues.documentStage === EDocumentState.CONFIRMED && !card.expired)
			) {
				return res
					.status(HttpStatusCode.BadRequest)
					.json({ message: ERROR_MESSAGE.CAN_NOT_UPDATE });
			}

			const updatedDocument = await new RenewOtherDependantDCService().update(id, {
				documentStage: EDocumentState.PENDING,
			});

			await new SharedDCService().sendMailWhenUserSubmitDCProccess(
				currentUser.email,
				currentUser.organismId,
				card.id,
				applicant,
			);

			return res.status(HttpStatusCode.Ok).json({
				message: SUCCESS_MESSAGE.UPDATE_SUCCESS_MESSAGE,
				data: updatedDocument,
			});
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message,
				details: error.details,
			});
		}
	}

	async adminValidation(
		req: Request<AdminValidateDocumentInput['params'], {}, AdminValidateDocumentInput['body']>,
		res: Response,
	) {
		try {
			const { id } = req.params;
			const data = req.body;
			const currentUser = res.locals.userAuth;

			const card = await new RenewOtherDependantDCService().getById(id);
			if (!card)
				{return res.status(HttpStatusCode.NotFound).json({ message: 'Carte non trouvable' });}

			if (!card.previousCard) {
				return res
					.status(HttpStatusCode.BadRequest)
					.json({ message: 'Carte originale non trouvée' });
			}

			if (
				card.previousCard.documentStage !== EDocumentState.CONFIRMED &&
				card.previousCard.documentStage !== EDocumentState.PRINTED
			) {
				return res
					.status(HttpStatusCode.BadRequest)
					.json({ message: "La carte originale n'a pas été confirmé" });
			}

			const updatedDocument = await new RenewOtherDependantDCService().update(id, data);

			await new SharedDCController().handleDCStageEmailByAdmin(
				{ documentStage: data.documentStage },
				{ email: card.previousCard.email, id: card.id },
				currentUser.email,
				applicant,
			);

			return res.status(HttpStatusCode.Ok).json({
				message: SUCCESS_MESSAGE.UPDATE_SUCCESS_MESSAGE,
				data: updatedDocument,
			});
		} catch (error: any) {
			console.error(error);
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message,
				details: error.details,
			});
		}
	}

	async superAdminValidation(
		req: Request<
			SuperAdminValidateDocumentInput['params'],
			{},
			SuperAdminValidateDocumentInput['body']
		>,
		res: Response,
	) {
		try {
			const { id } = req.params;
			const data = req.body;
			const currentUser = res.locals.userAuth;
			let payload = {};
			const validity = getDateThreeYearsFromNow();

			const card = await new RenewOtherDependantDCService().getById(id);
			if (!card)
				{return res.status(HttpStatusCode.NotFound).json({ message: 'Carte non trouvable' });}

			if (!card.previousCard) {
				return res
					.status(HttpStatusCode.BadRequest)
					.json({ message: 'Carte originale non trouvée' });
			}

			if (
				card.previousCard.documentStage !== EDocumentState.CONFIRMED &&
				card.previousCard.documentStage !== EDocumentState.PRINTED
			) {
				return res
					.status(HttpStatusCode.BadRequest)
					.json({ message: "La carte originale n'a pas été confirmé" });
			}

			const previousCard = await new SharedDCController().getDCByPreviousIdHelper(
				card.previousCardId,
				currentUser,
				OtherDependantDCService,
			);

			if (!previousCard) {
				return res
					.status(HttpStatusCode.NotFound)
					.json({ message: 'La carte dont on veut faire le renouvellement est non trouvable' });
			}

			if (data.documentStage === ESuperAdminDocumentState.CONFIRMED) {
				await new OtherDependantDCService().update(previousCard.id, { expired: true });
				payload = { ...data, newDateEndOfMission: validity };
			} else {
				payload = data;
			}

			const updatedDocument = await new RenewOtherDependantDCService().update(id, payload);

			await new SharedDCController().handleDCStageEmailBySuperAdmin(
				{ documentStage: data.documentStage },
				currentUser.email,
				{ id: card.id, organismId: card.previousCard.organismId },
				applicant,
			);

			return res.status(HttpStatusCode.Ok).json({
				message: SUCCESS_MESSAGE.UPDATE_SUCCESS_MESSAGE,
				data: updatedDocument,
			});
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message,
				details: error.details,
			});
		}
	}

	async getCardByNumber(req: Request<GetByCardNumberInput>, res: Response) {
		try {
			const { cardNumber } = req.params;
			const user = res.locals.userAuth;

			const card = await new SharedDCController().getCardByNumberHelper(
				cardNumber,
				user,
				RenewOtherDependantDCService,
			);
			if (!card) {
				return res.status(HttpStatusCode.NotFound).json({
					message: ERROR_MESSAGE.NOT_FOUND_MESSAGE,
				});
			}
			return res.status(HttpStatusCode.Ok).json({
				data: card,
			});
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message,
				details: error.details,
			});
		}
	}

	async setPrintedRenewOtherDependantDC(
		req: Request<
			{ id: string },
			{},
			{
				issueDate: string;
				validUntil: string;
				plaque?: string;
				type_card: string;
				color: string;
				observation?: string | null;
			}
		>,
		res: Response,
	) {
		try {
			const { id } = req.params;
			const data = req.body;
			const userAuth = res.locals.userAuth;

			const card = await authorizationService.getAuthorizedResource(
				new RenewOtherDependantDCService(),
				id,
				userAuth,
			);

			if (!card) {
				return res.status(HttpStatusCode.NotFound).json({
					message: ERROR_MESSAGE.NOT_FOUND_MESSAGE,
				});
			}

			if ((card as any).dataValues.documentStage === EDocumentState.CONFIRMED && !(card as any).dataValues.expired) {
				const updatedDocument = await new RenewOtherDependantDCService().update(id, {
					...data,
					documentStage: EDocumentState.PRINTED,
				});

				return res.status(HttpStatusCode.Ok).json({
					message: SUCCESS_MESSAGE.UPDATE_SUCCESS_MESSAGE,
					data: updatedDocument,
				});
			} else {
				return res
					.status(HttpStatusCode.BadRequest)
					.json({ message: ERROR_MESSAGE.CAN_NOT_UPDATE });
			}
		} catch (error: any) {
			return res.status(error.status || HttpStatusCode.InternalServerError).json({
				message: error.message,
			});
		}
	}

	async undoPrintRenewOtherDependantDC(req: Request<{ id: string }, {}, {}>, res: Response) {
		try {
			const { id } = req.params;

			const card = await new RenewOtherDependantDCService().getById(id);

			if (!card) {
				return res.status(HttpStatusCode.NotFound).json({
					message: ERROR_MESSAGE.NOT_FOUND_MESSAGE,
				});
			}

			if (card.dataValues.documentStage === EDocumentState.PRINTED && !card.expired) {
				const updatedDocument = await new RenewOtherDependantDCService().update(id, {
					documentStage: EDocumentState.CONFIRMED,
				});

				return res.status(HttpStatusCode.Ok).json({
					message: SUCCESS_MESSAGE.UPDATE_SUCCESS_MESSAGE,
					data: updatedDocument,
				});
			} else {
				return res
					.status(HttpStatusCode.BadRequest)
					.json({ message: ERROR_MESSAGE.CAN_NOT_UPDATE });
			}
		} catch (error: any) {
			return res.status(error.status || HttpStatusCode.InternalServerError).json({
				message: error.message,
			});
		}
	}

	async setReturned(req: Request<GetByIdInput>, res: Response) {
		try {
			const { id } = req.params;
			const userAuth = res.locals.userAuth;

			const card:any = await authorizationService.getAuthorizedResource(
				new RenewOtherDependantDCService(),
				id,
				userAuth,
			);

			if (card.documentStage !== EDocumentState.PRINTED) {
				return res.status(HttpStatusCode.BadRequest).json({
					message: 'La carte doit être imprimée pour être restituée',
				});
			}

			if (card.expired) {
				return res.status(HttpStatusCode.BadRequest).json({
					message: 'La carte expirée ne peut pas être restituée',
				});
			}

			const updatedCard = await new RenewOtherDependantDCService().update(id, {
				documentStage: EDocumentState.RETURNED,
			});

			return res.status(HttpStatusCode.Ok).json({
				message: SUCCESS_MESSAGE.UPDATE_SUCCESS_MESSAGE,
				data: updatedCard,
			});
		} catch (error: any) {
			return res.status(error.status || HttpStatusCode.InternalServerError).json({
				message: error.message,
			});
		}
	}
}

export default new RenewOtherDependantDCController();
