import { Request, Response } from 'express';
import { HttpStatusCode } from 'axios';
import { getDateThreeYearsFromNow } from '@shared/utils/functions';
import { SharedDCService } from '@shared/services/sharedDC.service';
import {
	AdminValidateDocumentInput,
	GetByCardNumberInput,
	GetByIdInput,
	SuperAdminValidateDocumentInput,
} from '@shared/schemas/public.schemas';
import { RenewOtherStaffDCService } from '../services/otherStaff-renew.service';
import { GetOtherStaffsDCInput } from '../dtos/otherStaff-card.dto';
import { OtherStaffDCService } from '../services/otherStaff-card.service';
import { UsersService } from '@modules/user/services/user.service';
import { AUTH_MESSAGES } from '../../../../constants/messages/auth.messages';
import authorizationService from '@shared/services/authorization.service';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '@constants/messages';
import { RoleEnum } from '@modules/user/types';
import { EDocumentState, ESuperAdminDocumentState } from '@modules/cards/types';
import SharedDCController from '@shared/controllers/sharedDC.controller';

const applicant = 'Autre personnels';

class RenewOtherStaffDCController {
	async getOtherStaffCard(req: Request<GetByIdInput>, res: Response) {
		try {
			const { id } = req.params;
			const userAuth = res.locals.userAuth;

			const card = await authorizationService.getAuthorizedResource(
				new RenewOtherStaffDCService(),
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

	async getOtherStaffsDC(req: Request<{}, {}, {}, GetOtherStaffsDCInput>, res: Response) {
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
			const response = await new RenewOtherStaffDCService().getEntities(
				userAuth.role === RoleEnum.SUPERADMIN || userAuth.role === RoleEnum.ADMIN
					? queryOptionsAdmin
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
			const cardToRenew = await new OtherStaffDCService().getById(id);
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

			const newOwnerCard = await new RenewOtherStaffDCService().save(payload);

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

	async pointFocalValidation(req: Request<GetByIdInput>, res: Response) {
		try {
			const { id } = req.params;

			const currentUser = res.locals.userAuth;

			const card = await new RenewOtherStaffDCService().getOne({
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

			const updatedDocument = await new RenewOtherStaffDCService().update(id, {
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

			const card = await new RenewOtherStaffDCService().getById(id);
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

			const updatedDocument = await new RenewOtherStaffDCService().update(id, data);

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

			const card = await new RenewOtherStaffDCService().getById(id);
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
				OtherStaffDCService,
			);

			if (!previousCard) {
				return res
					.status(HttpStatusCode.NotFound)
					.json({ message: 'La carte dont on veut faire le renouvellement est non trouvable' });
			}

			if (data.documentStage === ESuperAdminDocumentState.CONFIRMED) {
				await new OtherStaffDCService().update(previousCard.id, { expired: true });
				payload = { ...data, newDateEndOfMission: validity };
			} else {
				payload = data;
			}

			const updatedDocument = await new RenewOtherStaffDCService().update(id, payload);

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
				RenewOtherStaffDCService,
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

	// async requestDuplicataDC(req: Request<{}, {}, RequestDCDuplicataInput>, res: Response) {
	// 	try {
	// 		const data = req.body;
	// 		const user = res.locals.userAuth;
	// 		const card = await new SharedDCController().getDCByPreviousIdHelper(
	// 			data.previousDCId,
	// 			user,
	// 			RenewOtherStaffDCService,
	// 		);

	// 		if (!card) {
	// 			return res.status(HttpStatusCode.NotFound).json({
	// 				message: ERROR_MESSAGE.NOT_FOUND_MESSAGE,
	// 			});
	// 		}

	// 		if (card.documentStage !== EDocumentState.CONFIRMED) {
	// 			res.status(HttpStatusCode.Forbidden).json({ message: CARD_MESSAGE.NON_CONFIRME });
	// 		}

	// 		if (card.demandType !== EDemandType.NEW) {
	// 			res
	// 				.status(HttpStatusCode.Forbidden)
	// 				.json({ message: 'inserer le numero de la carte orignale' });
	// 		}

	// 		const code = user.getDataValue('organism').code;
	// 		const newCardNumber = await generateDCCardNumber(code);

	// 		const newOtherStaffCard = await new RenewOtherStaffDCService().save({
	// 			title: card.title,
	// 			firstName: card.firstName,
	// 			lastName: card.lastName,
	// 			email: card.email ?? '',
	// 			phone: card.phone ?? '',
	// 			matrimonialStatus: card.matrimonialStatus,
	// 			gender: card.gender,
	// 			dateOfBirth: new Date(card.dateOfBirth),
	// 			placeOfBirth: card.placeOfBirth,
	// 			citizenship: card.citizenship,
	// 			countryOfBirth: card.countryOfBirth,
	// 			grade: card.grade,
	// 			personReplaced: card.personReplaced ?? '',
	// 			cardNumber: newCardNumber,
	// 			jobFunction: card.jobFunction,
	// 			travellingNumber: card.travellingNumber,
	// 			deliverAt: card.deliverAt,
	// 			deliverBy: card.deliverBy,
	// 			deliverThe: card.deliverThe.toString(),
	// 			travellingTitleType: card.travellingTitleType,
	// 			dateTakingOffice: new Date(card.dateTakingOffice),
	// 			dateArrivalSenegal: new Date(card.dateArrivalSenegal),
	// 			travellingTitleValidUntil: new Date(card.travellingTitleValidUntil),
	// 			dateEndOfMission: new Date(card.dateEndOfMission),
	// 			lastCityAbroad: card.lastCityAbroad,
	// 			lastCountryAbroad: card.lastCountryAbroad,
	// 			latestOfWorkCountry: card.latestOfWorkCountry,
	// 			latestWorkStructure: card.latestWorkStructure,
	// 			lastestWorkDate: new Date(card.lastestWorkDate),
	// 			lastStreetAbroad: card.lastStreetAbroad,
	// 			creatorId: user.id,
	// 			demandType: EDemandType.DUPLICATA,
	// 			organismId: user.organismId,
	// 			previousCardNumber: card.cardNumber,
	// 			documentStage: EDocumentState.PENDING,
	// 		});

	// 		if (card.renewOtherStaffDCFiles) {
	// 			await new OtherStaffDCFileService().saveRenew({
	// 				OtherStaffDiplomaticCardId: newOtherStaffCard.id,
	// 				passportKey: card.renewOtherStaffDCFiles.passportKey,
	// 				photoKey: card.renewOtherStaffDCFiles.photoKey,
	// 				lcKey: card.renewOtherStaffDCFiles.lcKey,
	// 				othersKey: card.renewOtherStaffDCFiles.otherfilesKey,
	// 			});
	// 		}

	// 		return res.status(HttpStatusCode.Ok).json({
	// 			message: SUCCESS_MESSAGE.CREATION_SUCCESS_MESSAGE,
	// 			data: newOtherStaffCard,
	// 		});
	// 	} catch (error: any) {
	// 		return res.status(HttpStatusCode.InternalServerError).json({
	// 			message: error.message,
	// 		});
	// 	}
	// }

	//TODO --> STOPPED HERE FOR THE DUPLICATA, REMAINING OtherStaff AND OtherStaff
	//TODO ---> embassay validuntil is 3 years otheer is related to the end of mission date

	async setPrintedRenewOtherStaffDC(
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
				new RenewOtherStaffDCService(),
				id,
				userAuth,
			);

			if (!card) {
				return res.status(HttpStatusCode.NotFound).json({
					message: ERROR_MESSAGE.NOT_FOUND_MESSAGE,
				});
			}

			if (card.dataValues.documentStage === EDocumentState.CONFIRMED && !card.expired) {
				const updatedDocument = await new RenewOtherStaffDCService().update(id, {
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

	async undoPrintRenewOtherStaffDC(req: Request<{ id: string }, {}, {}>, res: Response) {
		try {
			const { id } = req.params;

			const card = await new RenewOtherStaffDCService().getById(id);

			if (!card) {
				return res.status(HttpStatusCode.NotFound).json({
					message: ERROR_MESSAGE.NOT_FOUND_MESSAGE,
				});
			}

			if (card.dataValues.documentStage === EDocumentState.PRINTED && !card.expired) {
				const updatedDocument = await new RenewOtherStaffDCService().update(id, {
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

			const card = await authorizationService.getAuthorizedResource(
				new RenewOtherStaffDCService(),
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

			const updatedCard = await new RenewOtherStaffDCService().update(id, {
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

export default new RenewOtherStaffDCController();
