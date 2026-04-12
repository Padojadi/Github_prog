import { Request, Response } from 'express';
import { EDemandType, EDocumentState, ESuperAdminDocumentState } from '@modules/cards/types';
import { generateDCCardNumber, generateUUID } from '@shared/utils/functions';
import { HttpStatusCode } from 'axios';
import {
	ERROR_MESSAGE,
	FILE_UPLOAD_ERROR_MESSAGE,
	FILE_UPLOAD_SUCCESS_MESSAGE,
	SUCCESS_MESSAGE,
} from '@constants/messages';
import { FileService } from '@shared/services/file.service';
import { CustomFile } from '@shared/types';
import { OwnerDCService } from '../../owner/services/owner-card.service';
import {
	CreateOtherDependantDCInput,
	GetOtherDependantsDCInput,
	OtherDependantDCbYIdInput,
	PrintOtherDependantDCSchema,
	UpdateOtherDependantDCInput,
} from '../dtos/otherDependant-card.dto';
import { OtherDependantDCService } from '../services/otherDependant-card.service';
import { AttachFileOtherDependantDCInput, DeleteFileInput } from '@shared/schemas/file.schema';
import { OtherDependantDCFileService } from '../services/otherDependant-card-file.service';
import { UsersService } from '@modules/user/services/user.service';
import { AUTH_MESSAGES } from '../../../../constants/messages/auth.messages';
import { SharedDCService } from '@shared/services/sharedDC.service';
import {
	AdminValidateDocumentInput,
	GetByCardNumberInput,
	GetByIdInput,
	SuperAdminValidateDocumentInput,
} from '@shared/schemas/public.schemas';
import { OtherDependantDCFileRepo } from '../repositories/otherDependant-card-file.repository';
import authorizationService from '@shared/services/authorization.service';
import { RoleEnum } from '@modules/user/types';
import SharedDCController from '@shared/controllers/sharedDC.controller';

const applicant = 'Autre dépendants';

class OtherDependantDCController {
	async create(req: Request<{}, {}, CreateOtherDependantDCInput>, res: Response) {
		try {
			const data = req.body;
			const user = res.locals.user;
			const demandType = EDemandType.NEW;

			const currentUser = await new UsersService().getUserById(user.id);

			if (!currentUser) {
				return res.status(HttpStatusCode.NotFound).json({
					message: AUTH_MESSAGES.ACCOUNT_NOT_FOUND,
				});
			}

			const ownerFile = await new OwnerDCService().getById(data.ownerDiplomaticCardId);
			if (!ownerFile) {
				return res
					.status(HttpStatusCode.NotFound)
					.json({ message: 'Dossier du titulaire non trouvable' });
			}

			const newOwnerCard = await new OtherDependantDCService().save({
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email ?? '',
				phone: data.phone ?? '',
				gender: data.gender,
				dateOfBirth: new Date(data.dateOfBirth),
				placeOfBirth: data.placeOfBirth,
				citizenship: data.citizenship,
				countryOfBirth: data.countryOfBirth,
				travellingNumber: data.travellingNumber,
				deliverAt: data.deliverAt,
				deliverBy: data.deliverBy,
				deliverThe: data.deliverThe,
				issueDate: data.issueDate,
				travellingTitleType: data.travellingTitleType,
				travellingTitleValidUntil: data.travellingTitleValidUntil,
				creatorId: user.id,
				demandType: demandType,
				ownerDiplomaticCardId: data.ownerDiplomaticCardId,
				organismId: currentUser.organismId,
				validUntil: ownerFile.dateEndOfMission,
			});

			return res.status(HttpStatusCode.Ok).json({
				demandType,
				message: SUCCESS_MESSAGE.CREATION_SUCCESS_MESSAGE,
				data: newOwnerCard,
			});
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message,
			});
		}
	}

	async getById(req: Request<OtherDependantDCbYIdInput>, res: Response) {
		try {
			const { id } = req.params;
			const userAuth = res.locals.userAuth;

			const card = await authorizationService.getAuthorizedResource(
				new OtherDependantDCService(),
				id,
				userAuth,
			);

			if (card.otherDependantDCFiles) {
				const fileService = new FileService();
				const { passportKey, adKey, photoKey, othersKey } = card.otherDependantDCFiles;

				const presignUrl = passportKey ? await fileService.getFileUrl(passportKey) : null;
				const presignUrlAD = adKey ? await fileService.getFileUrl(adKey) : null;
				const presignUrlPhoto = photoKey ? await fileService.getFileUrl(photoKey) : null;
				const presignUrlOthers = othersKey ? await fileService.getFilesUrl(othersKey) : [];

				const cardsWithUrls = {
					...card.dataValues,
					passportLink: presignUrl,
					adLink: presignUrlAD,
					photoLink: presignUrlPhoto,
					presignUrlOthersLink: presignUrlOthers,
				};
				return res.status(HttpStatusCode.Ok).json({
					data: cardsWithUrls,
				});
			}
			return res.status(HttpStatusCode.Ok).json({
				data: card,
			});
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message,
			});
		}
	}

	async attachFiles(req: Request<{}, {}, AttachFileOtherDependantDCInput>, res: Response) {
		try {
			const { otherDependantDCId } = req.body;
			const userAuth = res.locals.userAuth;

			const card = await authorizationService.getAuthorizedResource(
				new OtherDependantDCService(),
				otherDependantDCId,
				userAuth,
			);

			if (card.otherDependantDCFiles && card.otherDependantDCFiles.id) {
				return res.status(HttpStatusCode.MethodNotAllowed).json({
					message: ERROR_MESSAGE.INVALID_REQUEST,
				});
			}

			const uploadFile = async (fileKey: string, file: CustomFile): Promise<string> => {
				return await new FileService().uploadFile(fileKey, file);
			};

			const uploadPromises: Promise<string>[] = [];

			if (!req.files)
				{return res
					.status(HttpStatusCode.BadRequest)
					.json({ message: 'Veuillez inserez les fichiers requis!' });}

			if (!('passport' in req.files)) {
				return res.status(HttpStatusCode.BadRequest).json({
					message: 'Inserer un fichier passport',
				});
			}
			uploadPromises.push(
				uploadFile(`cartesDiplomatique/${card.id}/${generateUUID()}`, req.files['passport'][0]),
			);

			if (!('photo' in req.files)) {
				return res.status(HttpStatusCode.BadRequest).json({
					message: 'Inserer une photo',
				});
			}
			uploadPromises.push(
				uploadFile(`cartesDiplomatique/${card.id}/${generateUUID()}`, req.files['photo'][0]),
			);

			if (!('ad' in req.files)) {
				return res.status(HttpStatusCode.BadRequest).json({
					message: 'Inserer un fichier ad',
				});
			}
			uploadPromises.push(
				uploadFile(`cartesDiplomatique/${card.id}/${generateUUID()}`, req.files['ad'][0]),
			);

			const others: CustomFile[] = (req.files?.others as CustomFile[]) || [];
			for (const file of others) {
				uploadPromises.push(uploadFile(`cartesDiplomatique/${card.id}/${generateUUID()}`, file));
			}

			const [passportKey, photoKey, adKey, ...otherfilesKey] = await Promise.all(uploadPromises);

			if (!passportKey || !adKey) {
				return res.status(HttpStatusCode.BadRequest).json({
					message: FILE_UPLOAD_ERROR_MESSAGE.UPLOAD_FAILED,
				});
			}

			const newAttachedFile = await new OtherDependantDCFileService().save({
				otherDependantDCId: otherDependantDCId,
				passportKey: photoKey,
				photoKey: photoKey,
				adKey: adKey,
				othersKey: otherfilesKey,
			});

			return res.status(HttpStatusCode.Ok).json({
				message: FILE_UPLOAD_SUCCESS_MESSAGE.UPLOAD_SUCCESS,
				data: newAttachedFile,
			});
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message,
			});
		}
	}

	async getList(req: Request<{}, {}, {}, GetOtherDependantsDCInput>, res: Response) {
		try {
			const {
				status,
				search,
				page,
				limit,
				sort,
				documentStage,
				organismId,
				ownerCardId,
				creatorId,
				id,
				expired,
			} = req.query;
			const userAuth = res.locals.userAuth;

			const queryOptions = {
				status: status,
				search: search,
				page: page,
				limit: limit,
				sort: sort,
				documentStage: documentStage,
				ownerCardId,
				id: id,
				expired: expired,
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

			const response = await new OtherDependantDCService().getOtherDependantsDC(
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
			});
		}
	}

	async update(
		req: Request<UpdateOtherDependantDCInput['params'], {}, UpdateOtherDependantDCInput['body']>,
		res: Response,
	) {
		try {
			const { id } = req.params;
			const data = req.body;
			const userAuth = res.locals.userAuth;

			const card = await authorizationService.getAuthorizedResource(
				new OtherDependantDCService(),
				id,
				userAuth,
			);

			const otherDependantDCService = new OtherDependantDCService();
			otherDependantDCService.validateCanUpdate(card, userAuth.role);

			const updatedDocument = await new OtherDependantDCService().update(id, data);

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

	async attachOtherFiles(req: Request<{}, {}, AttachFileOtherDependantDCInput>, res: Response) {
		try {
			const { otherDependantDCId } = req.body;
			const userAuth = res.locals.userAuth;

			const card = await authorizationService.getAuthorizedResource(
				new OtherDependantDCService(),
				otherDependantDCId,
				userAuth,
			);

			if (!card.otherDependantDCFiles || !card.otherDependantDCFiles?.id) {
				return res.status(HttpStatusCode.NotFound).json({
					message: ERROR_MESSAGE.NOT_FOUND_MESSAGE,
				});
			}
			const otherDependantFiles = await new OtherDependantDCFileRepo().findById(
				card.otherDependantDCFiles.id,
			);

			if (!otherDependantFiles) {
				return res.status(HttpStatusCode.NotFound).json({
					message: ERROR_MESSAGE.NOT_FOUND_MESSAGE,
				});
			}
			let photoKey = otherDependantFiles.photoKey;
			let passportKey = otherDependantFiles.passportKey;
			let adKey = otherDependantFiles.adKey;

			const uploadFile = async (fileKey: string, file: CustomFile): Promise<string> => {
				return await new FileService().uploadFile(fileKey, file);
			};
			const deleteFile = async (fileKey: string): Promise<string> => {
				return await new FileService().deleteFile(fileKey);
			};

			const deletePromises: Promise<string>[] = [];
			const uploadOthersPromises: Promise<string>[] = [];

			if (!req.files)
				{return res
					.status(HttpStatusCode.BadRequest)
					.json({ message: 'Veuillez inserez les fichiers!' });}

			if ('passport' in req.files) {
				if (otherDependantFiles.passportKey) {
					deletePromises.push(deleteFile(otherDependantFiles.passportKey));
				}

				passportKey = await uploadFile(
					`cartesDiplomatique/${card.id}/${generateUUID()}`,
					req.files['passport'][0],
				);
			}

			if ('ad' in req.files) {
				if (otherDependantFiles.adKey) {
					deletePromises.push(deleteFile(otherDependantFiles.adKey));
				}

				adKey = await uploadFile(
					`cartesDiplomatique/${card.id}/${generateUUID()}`,
					req.files['ad'][0],
				);
			}
			if ('photo' in req.files) {
				if (otherDependantFiles.photoKey) {
					deletePromises.push(deleteFile(otherDependantFiles.photoKey));
				}
				photoKey = await uploadFile(
					`cartesDiplomatique/${card.id}/${generateUUID()}`,
					req.files['photo'][0],
				);
			}

			if ('others' in req.files) {
				const others: CustomFile[] = (req.files?.others as CustomFile[]) || [];
				for (const file of others) {
					uploadOthersPromises.push(
						uploadFile(`cartesDiplomatique/${card.id}/${generateUUID()}`, file),
					);
				}
			}

			const uploadedOtherFileKeys = await Promise.all(uploadOthersPromises);

			if (uploadedOtherFileKeys.length > 0) {
				if (otherDependantFiles.othersKey) { /* empty */ }
				const existingOtherFiles = otherDependantFiles.getDataValue('othersKey') ?? [];
				otherDependantFiles.setDataValue('othersKey', [
					...existingOtherFiles,
					...uploadedOtherFileKeys,
				]);
			}

			await new OtherDependantDCFileRepo().update(otherDependantFiles.id, {
				passportKey: passportKey,
				adKey: adKey,
				photoKey: photoKey,
				othersKey: otherDependantFiles.getDataValue('othersKey'),
			});
			if (deletePromises.length !== 0) {
				await Promise.all(deletePromises);
			}
			await Promise.all(deletePromises);
			return res.status(HttpStatusCode.Ok).json({
				message: SUCCESS_MESSAGE.UPDATE_SUCCESS_MESSAGE,
			});
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message,
			});
		}
	}

	async deleteOtherFiles(
		req: Request<DeleteFileInput['params'], {}, DeleteFileInput['body']>,
		res: Response,
	) {
		try {
			const { id } = req.params;
			const { fileKeys } = req.body;
			const userAuth = res.locals.userAuth;

			const card = await authorizationService.getAuthorizedResource(
				new OtherDependantDCService(),
				id,
				userAuth,
			);

			if (!card.otherDependantDCFiles || !card.otherDependantDCFiles?.id) {
				return res.status(HttpStatusCode.NotFound).json({
					message: ERROR_MESSAGE.NOT_FOUND_MESSAGE,
				});
			}
			const otherDependantFiles = await new OtherDependantDCFileRepo().findById(
				card.otherDependantDCFiles.id,
			);

			if (!otherDependantFiles) {
				return res.status(HttpStatusCode.NotFound).json({
					message: ERROR_MESSAGE.NOT_FOUND_MESSAGE,
				});
			}
			const deletePromises: Promise<string>[] = [];
			const deleteFile = async (fileKey: string): Promise<string> => {
				return await new FileService().deleteFile(fileKey);
			};

			if (otherDependantFiles.othersKey && otherDependantFiles.othersKey?.length > 0) {
				deletePromises.push();
				for (const file of fileKeys) {
					deletePromises.push(deleteFile(file));
					otherDependantFiles.othersKey = otherDependantFiles.othersKey.filter((x) => x !== file);
				}
			}
			await new OtherDependantDCFileRepo().update(otherDependantFiles.id, {
				othersKey: otherDependantFiles.othersKey,
			});
			await Promise.all(deletePromises);
			return res.status(HttpStatusCode.Ok).json({
				message: SUCCESS_MESSAGE.UPDATE_SUCCESS_MESSAGE,
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

			const card = await new OtherDependantDCService().getOne({
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

			const updatedDocument = await new OtherDependantDCService().update(id, {
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
			return res.status(error.status || HttpStatusCode.InternalServerError).json({
				message: error.message,
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

			const card = await new OtherDependantDCService().getById(id);
			if (!card)
				{return res.status(HttpStatusCode.NotFound).json({ message: 'Carte non trouvable' });}

			if (
				(card.documentStage === EDocumentState.APPROVED && !card.expired) ||
				(card.documentStage === EDocumentState.CONFIRMED && !card.expired)
			) {
				return res
					.status(HttpStatusCode.BadRequest)
					.json({ message: ERROR_MESSAGE.CAN_NOT_UPDATE });
			}

			const updatedDocument = await new OtherDependantDCService().update(id, data);

			await new SharedDCController().handleDCStageEmailByAdmin(
				{ documentStage: data.documentStage },
				{ email: card.email, id: card.id },
				currentUser.email,
				applicant,
			);

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

	async deleteOtherDependantDC(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const userAuth = res.locals.userAuth;

			const card = await authorizationService.getAuthorizedResource(
				new OtherDependantDCService(),
				id,
				userAuth,
			);

			const otherDependantDCService = new OtherDependantDCService();
			otherDependantDCService.validateCanDelete(card);

			// Récupérer ses fichiers associés
			const files = await new OtherDependantDCFileService().getAll({
				where: { otherDependantDCId: id },
			});

			await new OtherDependantDCService().delete(id);

			// Supression des fichiers de S3
			const deleteFile = async (fileKey: string): Promise<string> => {
				return await new FileService().deleteFile(fileKey);
			};

			const deletePromises: Promise<string>[] = [];

			for (const file of files) {
				const photoKey = file.photoKey;
				const passportKey = file.passportKey;
				const adKey = file.adKey;
				const othersKey = file.othersKey;

				if (photoKey) {deletePromises.push(deleteFile(photoKey));}
				if (passportKey) {deletePromises.push(deleteFile(passportKey));}
				if (adKey) {deletePromises.push(deleteFile(adKey));}
				othersKey?.forEach((key) => {
					deletePromises.push(deleteFile(key));
				});
			}

			if (deletePromises.length !== 0) {
				Promise.all(deletePromises);
			}

			return res.status(HttpStatusCode.Ok).json({
				message: SUCCESS_MESSAGE.DELETE_SUCCESS_MESSAGE,
			});
		} catch (error: any) {
			return res.status(error.status || HttpStatusCode.InternalServerError).json({
				message: error.message,
			});
		}
	}

	async setPrintOtherDependantDC(
		req: Request<PrintOtherDependantDCSchema['params'], {}, PrintOtherDependantDCSchema['body']>,
		res: Response,
	) {
		try {
			const { id } = req.params;
			const data = req.body;
			const userAuth = res.locals.userAuth;

			const card = await authorizationService.getAuthorizedResource(
				new OtherDependantDCService(),
				id,
				userAuth,
			);

			const otherDependantDCService = new OtherDependantDCService();
			otherDependantDCService.validateCanPrint(card);

			const updatedDocument = await new OtherDependantDCService().update(id, {
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

	async undoOtherDependantDC(
		req: Request<PrintOtherDependantDCSchema['params'], {}, {}>,
		res: Response,
	) {
		try {
			const { id } = req.params;

			const card = await new OtherDependantDCService().getById(id);

			if (!card) {
				return res.status(HttpStatusCode.NotFound).json({
					message: ERROR_MESSAGE.NOT_FOUND_MESSAGE,
				});
			}

			const otherDependantDCService = new OtherDependantDCService();
			otherDependantDCService.validateCanUndoPrint(card);

			const updatedDocument = await new OtherDependantDCService().update(id, {
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

			const card = await new OtherDependantDCService().getById(id);
			if (!card)
				{return res.status(HttpStatusCode.NotFound).json({ message: 'Carte non trouvable' });}

			const ownerDiplomaticCard = card.ownerDiplomaticCard;

			if (data.documentStage === ESuperAdminDocumentState.CONFIRMED) {
				if (
					ownerDiplomaticCard?.documentStage !== EDocumentState.CONFIRMED &&
					ownerDiplomaticCard?.documentStage !== EDocumentState.PRINTED
				) {
					return res.status(HttpStatusCode.BadRequest).json({
						message: "La carte du titulaire n'a pas été confirmée",
					});
				}
				const validity = ownerDiplomaticCard?.dateEndOfMission;
				if (!validity) {
					return res.status(HttpStatusCode.BadRequest).json({
						message: 'Date de fin de mission requise pour le titulaire associé à cette carte',
					});
				}
				payload = { ...data, validUntil: validity };
			} else {
				payload = data;
			}

			if (!card.organism) {
				return res.status(HttpStatusCode.BadRequest).json({
					message: 'Organisme non trouvé',
				});
			}

			const code = card.organism.code;
			const newCardNumber = await generateDCCardNumber(code);
			const updatedDocument = await new OtherDependantDCService().update(id, {
				...payload,
				cardNumber: newCardNumber,
			});

			await new SharedDCController().handleDCStageEmailBySuperAdmin(
				{ documentStage: data.documentStage },
				currentUser.email,
				{ id: card.id, organismId: card.organismId },
				applicant,
			);

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

	async getCardByNumber(req: Request<GetByCardNumberInput>, res: Response) {
		try {
			const { cardNumber } = req.params;
			const user = res.locals.userAuth;

			const card = await new SharedDCController().getCardByNumberHelper(
				cardNumber,
				user,
				OtherDependantDCService,
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
				new OtherDependantDCService(),
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

			const updatedCard = await new OtherDependantDCService().update(id, {
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

export default new OtherDependantDCController();
