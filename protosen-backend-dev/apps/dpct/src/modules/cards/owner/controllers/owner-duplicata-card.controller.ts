import { Request, Response } from 'express';
import { HttpStatusCode } from 'axios';
import {
	CreateDuplicataDCInput,
	GetsDuplicataDCsInput,
	PrintOwnerDuplicataDCSchema,
} from '../dtos/owner-duplicata.dto';
import { OwnerDuplicataDCService } from '../services/owner-duplicata.service';
import authorizationService from '../../../../shared/services/authorization.service';
import {
	AdminValidateDocumentInput,
	GetByIdInput,
	SuperAdminValidateDocumentInput,
} from '../../../../shared/schemas/public.schemas';
import { SharedDCService } from '../../../../shared/services/sharedDC.service';
import { OwnerDCService } from '../services/owner-card.service';
import { RenewOwnerDCService } from '../services/owner-renew.service';
import SharedDCController from '@shared/controllers/sharedDC.controller';
import { CARD_MESSAGE, ERROR_MESSAGE, SUCCESS_MESSAGE } from '@constants/messages';
import { EDocumentState } from '@modules/cards/types';
import { UsersService } from '@modules/user/services/user.service';
import { AUTH_MESSAGES } from '@constants/index';
import { RoleEnum } from '@modules/user/types';

const applicant = 'Titulaire';

class OwnerDuplicataDCController {
	async demandDuplicataCard(req: Request<{}, {}, CreateDuplicataDCInput>, res: Response) {
		try {
			const data = req.body;
			const user = res.locals.userAuth;

			let card: any;
			if (data.renewCardId) {
				card = await new SharedDCController().getDCByPreviousIdHelper(
					data.renewCardId,
					user,
					RenewOwnerDCService,
				);
			} else {
				card = await new SharedDCController().getDCByPreviousIdHelper(
					data.previousCardId!,
					user,
					OwnerDCService,
				);
			}

			if (!card) {
				return res.status(HttpStatusCode.NotFound).json({
					message: ERROR_MESSAGE.NOT_FOUND_MESSAGE,
				});
			}
			if (card.documentStage !== EDocumentState.PRINTED) {
				return res.status(HttpStatusCode.BadRequest).json({ message: CARD_MESSAGE.NON_IMPRIME });
			}

			if (card.expired) {
				return res.status(HttpStatusCode.BadRequest).json({ message: CARD_MESSAGE.EXPIRE });
			}

			const dateEndOfMission = data.renewCardId
				? new Date(card.newDateEndOfMission || card.previousCard?.dateEndOfMission)
				: new Date(card.dateEndOfMission);
			const currentDate = new Date();

			if (currentDate > dateEndOfMission) {
				return res.status(HttpStatusCode.BadRequest).json({ message: CARD_MESSAGE.EXPIRE });
			}

			const newDuplicata = await new OwnerDuplicataDCService().save({
				...(data.renewCardId ? { renewCardId: data.renewCardId } : { previousCardId: data.previousCardId }),
				creatorId: user.id,
				organismId: user.organismId,
			});

			return res
				.status(HttpStatusCode.Created)
				.json({ message: SUCCESS_MESSAGE.CREATION_SUCCESS_MESSAGE, data: newDuplicata });
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message,
				details: error.details,
			});
		}
	}

	async getOwnersDuplicataDC(req: Request<{}, {}, {}, GetsDuplicataDCsInput>, res: Response) {
		try {
			const user = res.locals.user;
			const {
				status,
				search,
				page,
				limit,
				sort,
				documentStage,
				organismId,
				creatorId,
				id,
				expired,
			} = req.query;

			const currentUser = await new UsersService().getUserById(user.id);

			if (!currentUser) {
				return res.status(HttpStatusCode.NotFound).json({
					message: AUTH_MESSAGES.ACCOUNT_NOT_FOUND,
				});
			}

			const queryOptions = {
				status: status,
				search: search,
				page: page,
				limit: limit,
				sort: sort,
				documentStage: documentStage,
				organismId: organismId,
				creatorId: creatorId,
				id: id,
				expired: expired,
			};

			const queryOptionsUser = {
				...queryOptions,
				creatorId: currentUser.id,
				organismId: currentUser.organismId,
			};

			const response = await new OwnerDuplicataDCService().getAll(
				currentUser.role === RoleEnum.SUPERADMIN || currentUser.role === RoleEnum.ADMIN
					? queryOptions
					: queryOptionsUser,
			);
			return res.status(HttpStatusCode.Ok).json({
				message: SUCCESS_MESSAGE.FETCH_SUCCESS_MESSAGE,
				data: response,
			});
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message,
				details: error.details,
			});
		}
	}

	async getOwnerDuplicactaDC(req: Request<GetByIdInput>, res: Response) {
		try {
			const { id } = req.params;
			const userAuth = res.locals.userAuth;

			const card = await authorizationService.getAuthorizedResource(
				new OwnerDuplicataDCService(),
				id,
				userAuth,
			);

			return res.status(HttpStatusCode.Ok).json({
				data: card,
			});
		} catch (error: any) {
			return res.status(error.status || HttpStatusCode.InternalServerError).json({
				message: error.message,
			});
		}
	}

	async pointFocalValidation(req: Request<GetByIdInput>, res: Response) {
		try {
			const { id } = req.params;

			const currentUser = res.locals.userAuth;

			const card = await new OwnerDuplicataDCService().getOne({
				where: { id: id },
			});

			if (!card) {
				return res
					.status(HttpStatusCode.NotFound)
					.json({ message: 'Carte duplicata non trouvable' });
			}

			const sourceCard = (card as any).renewCard ?? card.previousCard;
			if (!sourceCard) {
				return res
					.status(HttpStatusCode.BadRequest)
					.json({ message: 'Carte originale non trouvée' });
			}

			const isStageFinalized = [
				EDocumentState.APPROVED,
				EDocumentState.PRINTED,
				EDocumentState.CONFIRMED,
			].includes(card.dataValues.documentStage as EDocumentState);

			if (isStageFinalized && !sourceCard.expired) {
				return res
					.status(HttpStatusCode.BadRequest)
					.json({ message: ERROR_MESSAGE.CAN_NOT_UPDATE });
			}

			const updatedDocument = await new OwnerDuplicataDCService().update(id, {
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

			const card = await new OwnerDuplicataDCService().getById(id);

			const sourceCard = (card as any).renewCard ?? card.previousCard;
			if (!sourceCard) {
				return res
					.status(HttpStatusCode.BadRequest)
					.json({ message: 'Carte originale non trouvée' });
			}

			const baseCard = (card as any).renewCard?.previousCard ?? card.previousCard;

			const isStageFinalized = [
				EDocumentState.APPROVED,
				EDocumentState.PRINTED,
				EDocumentState.CONFIRMED,
			].includes(card.dataValues.documentStage as EDocumentState);

			if (isStageFinalized && !sourceCard.expired) {
				return res
					.status(HttpStatusCode.BadRequest)
					.json({ message: ERROR_MESSAGE.CAN_NOT_UPDATE });
			}

			const updatedDocument = await new OwnerDuplicataDCService().update(id, data);
			await new SharedDCController().handleDCStageEmailByAdmin(
				{ documentStage: data.documentStage },
				{ email: baseCard?.email, id: card.id },
				currentUser.email,
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

			const card = await new OwnerDuplicataDCService().getById(id);

			const sourceCard = (card as any).renewCard ?? card.previousCard;
			if (!sourceCard) {
				return res
					.status(HttpStatusCode.BadRequest)
					.json({ message: 'Carte originale non trouvée' });
			}

			const baseCard = (card as any).renewCard?.previousCard ?? card.previousCard;

			const updatedDocument = await new OwnerDuplicataDCService().update(id, { ...data });

			await new SharedDCController().handleDCStageEmailBySuperAdmin(
				{ documentStage: data.documentStage },
				currentUser.email,
				{ id: card.id, organismId: baseCard?.organismId },
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

	async setPrintedOwnerDuplicataDC(
		req: Request<PrintOwnerDuplicataDCSchema['params'], {}, PrintOwnerDuplicataDCSchema['body']>,
		res: Response,
	) {
		try {
			const { id } = req.params;
			const data = req.body;
			const userAuth = res.locals.userAuth;

			const card = await authorizationService.getAuthorizedResource(
				new OwnerDuplicataDCService(),
				id,
				userAuth,
			);

			const ownerDuplicataDCService = new OwnerDuplicataDCService();
			ownerDuplicataDCService.validateCanPrint(card);

			const updatedDocument = await ownerDuplicataDCService.update(id, {
				...data,
				documentStage: EDocumentState.PRINTED,
			});

			return res.status(HttpStatusCode.Ok).json({
				message: SUCCESS_MESSAGE.UPDATE_SUCCESS_MESSAGE,
				data: updatedDocument,
			});
		} catch (error: any) {
			return res.status(error.status || HttpStatusCode.InternalServerError).json({
				message: error.message,
			});
		}
	}

	async undoPrintOwnerDuplicataDC(
		req: Request<PrintOwnerDuplicataDCSchema['params'], {}, {}>,
		res: Response,
	) {
		try {
			const { id } = req.params;

			const card = await new OwnerDuplicataDCService().getById(id);

			if (!card) {
				return res.status(HttpStatusCode.NotFound).json({
					message: ERROR_MESSAGE.NOT_FOUND_MESSAGE,
				});
			}

			const ownerDuplicataDCService = new OwnerDuplicataDCService();
			ownerDuplicataDCService.validateCanUndoPrint(card);

			const updatedDocument = await ownerDuplicataDCService.update(id, {
				documentStage: EDocumentState.CONFIRMED,
			});

			return res.status(HttpStatusCode.Ok).json({
				message: SUCCESS_MESSAGE.UPDATE_SUCCESS_MESSAGE,
				data: updatedDocument,
			});
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

			const ownerDuplicataDCService = new OwnerDuplicataDCService();

			const card = await authorizationService.getAuthorizedResource(
				ownerDuplicataDCService,
				id,
				userAuth,
			);

			if (card.documentStage !== EDocumentState.PRINTED) {
				return res.status(HttpStatusCode.BadRequest).json({
					message: 'La carte doit être imprimée pour être restituée',
				});
			}

			const sourceCard = (card as any).renewCard ?? card.previousCard;
			if (sourceCard && sourceCard.expired) {
				return res.status(HttpStatusCode.BadRequest).json({
					message: 'La carte expirée ne peut pas être restituée',
				});
			}

			const updatedCard = await ownerDuplicataDCService.update(id, {
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

export default new OwnerDuplicataDCController();
