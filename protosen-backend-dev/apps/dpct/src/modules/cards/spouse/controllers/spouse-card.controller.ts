import { Request, Response } from 'express';
import {
	CreateSpouseDCInput,
	GetSpousesDCInput,
	PrintSpouseDCSchema,
	SpouseDCbYIdInput,
	UpdateSpouseDCInput,
} from '../dtos/spouse-card.dto';
import { SpouseDCService } from '../services/spouse-card.service';
import { generateDCCardNumber, generateUUID } from '@shared/utils/functions';
import { HttpStatusCode } from 'axios';

import { AttachFileSpouseDCInput, DeleteFileInput } from '@shared/schemas/file.schema';
import { FileService } from '@shared/services/file.service';
import { SpouseDCFileService } from '../services/spouse-card-file.service';
import { OwnerDCService } from '../../owner/services/owner-card.service';
import { UsersService } from '@modules/user/services/user.service';
import { SpouseDCFileRepo } from '../repositories/spouse-card-file.repository';
import authorizationService from '@shared/services/authorization.service';
import { AUTH_MESSAGES } from '../../../../constants/messages/auth.messages';
import {
	AdminValidateDocumentInput,
	GetByCardNumberInput,
	GetByIdInput,
	SuperAdminValidateDocumentInput,
} from '@shared/schemas/public.schemas';
import { SharedDCService } from '@shared/services/sharedDC.service';
import { EDemandType, EDocumentState, ESuperAdminDocumentState } from '@modules/cards/types';
import {
	ERROR_MESSAGE,
	FILE_UPLOAD_ERROR_MESSAGE,
	FILE_UPLOAD_SUCCESS_MESSAGE,
	SUCCESS_MESSAGE,
} from '@constants/messages';
import { CustomFile } from '@shared/types';
import { RoleEnum } from '@modules/user/types';
import SharedDCController from '@shared/controllers/sharedDC.controller';

const applicant = 'Epoux(ses)';

class SpouseDCController {
	async create(req: Request<{}, {}, CreateSpouseDCInput>, res: Response) {
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

			const newSpouseCard = await new SpouseDCService().save({
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
				data: newSpouseCard,
			});
		} catch (error: any) {
			return res.status(error.status).json({
				message: error.message,
				details: error.details,
			});
		}
	}

	async deleteSpouseDC(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const userAuth = res.locals.userAuth;

			const card = await authorizationService.getAuthorizedResource(
				new SpouseDCService(),
				id,
				userAuth,
			);

			const spouseDCService = new SpouseDCService();
			spouseDCService.validateCanDelete(card);

			// Récupérer ses fichiers associés
			const files = await new SpouseDCFileService().getAll({
				where: { spouseDCId: id },
			});

			await new SpouseDCService().delete(id);

			// Supression des fichiers de S3
			const deleteFile = async (fileKey: string): Promise<string> => {
				return await new FileService().deleteFile(fileKey);
			};

			const deletePromises: Promise<string>[] = [];

			for (const file of files) {
				const photoKey = file.photoKey;
				const passportKey = file.passportKey;
				const amKey = file.amKey;
				const othersKey = file.othersKey;

				deletePromises.push(deleteFile(photoKey));
				deletePromises.push(deleteFile(passportKey));
				deletePromises.push(deleteFile(amKey));
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

	async getSpouseDC(req: Request<SpouseDCbYIdInput>, res: Response) {
		try {
			const { id } = req.params;
			const userAuth = res.locals.userAuth;

			const card = await authorizationService.getAuthorizedResource(
				new SpouseDCService(),
				id,
				userAuth,
			);

			if (card.spouseDCFiles) {
				const presignUrl = await new FileService().getFileUrl(card.spouseDCFiles.passportKey);
				const presignUrlLC = await new FileService().getFileUrl(card.spouseDCFiles.amKey);
				const presignUrlPhoto = await new FileService().getFileUrl(card.spouseDCFiles.photoKey);

				let presignUrlOthers: string[] = [];
				if (card.spouseDCFiles.othersKey) {
					presignUrlOthers = await new FileService().getFilesUrl(card.spouseDCFiles.othersKey);
				}

				const cardsWithUrls = {
					...card.dataValues,
					passportLink: presignUrl,
					amLink: presignUrlLC,
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
			return res.status(error.status).json({
				message: error.message,
				details: error.details,
			});
		}
	}

	async attachFiles(req: Request<{}, {}, AttachFileSpouseDCInput>, res: Response) {
		try {
			const { spouseDCId } = req.body;
			const userAuth = res.locals.userAuth;

			const card = await authorizationService.getAuthorizedResource(
				new SpouseDCService(),
				spouseDCId,
				userAuth,
			);

			if (card.spouseDCFiles && card.spouseDCFiles.id) {
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

			if (!('am' in req.files)) {
				return res.status(HttpStatusCode.BadRequest).json({
					message: 'Inserer un acte de mariage',
				});
			}
			uploadPromises.push(
				uploadFile(`cartesDiplomatique/${card.id}/${generateUUID()}`, req.files['am'][0]),
			);

			const others: CustomFile[] = (req.files?.others as CustomFile[]) || [];
			for (const file of others) {
				uploadPromises.push(uploadFile(`cartesDiplomatique/${card.id}/${generateUUID()}`, file));
			}

			const [passportKey, photoKey, amKey, ...otherfilesKey] = await Promise.all(uploadPromises);

			if (!passportKey || !amKey || !photoKey) {
				return res.status(HttpStatusCode.BadRequest).json({
					message: FILE_UPLOAD_ERROR_MESSAGE.UPLOAD_FAILED,
				});
			}

			const newAttachedFile = await new SpouseDCFileService().save({
				spouseDCId: spouseDCId,
				passportKey: passportKey,
				amKey: amKey,
				photoKey: photoKey,
				othersKey: otherfilesKey,
			});

			return res.status(HttpStatusCode.Ok).json({
				message: FILE_UPLOAD_SUCCESS_MESSAGE.UPLOAD_SUCCESS,
				data: newAttachedFile,
			});
		} catch (error: any) {
			return res.status(error.status).json({
				message: error.message,
				details: error.details,
			});
		}
	}

	async getSpousesDC(req: Request<{}, {}, {}, GetSpousesDCInput>, res: Response) {
		try {
			const {
				status,
				search,
				page,
				limit,
				sort,
				documentStage,
				creatorId,
				ownerCardId,
				organismId,
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
				ownerCardId,
				documentStage: documentStage,
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
			const response = await new SpouseDCService().getSpousesDC(
				userAuth.role === RoleEnum.SUPERADMIN || userAuth.role === RoleEnum.ADMIN
					? queryOptionsAdmin
					: queryOptionsUser,
			);
			return res.status(HttpStatusCode.Ok).json({
				message: SUCCESS_MESSAGE.FETCH_SUCCESS_MESSAGE,
				data: response,
			});
		} catch (error: any) {
			return res.status(error.status).json({
				message: error.message,
				details: error.details,
			});
		}
	}

	async updateSpouseDC(
		req: Request<UpdateSpouseDCInput['params'], {}, UpdateSpouseDCInput['body']>,
		res: Response,
	) {
		try {
			const { id } = req.params;
			const data = req.body;
			const userAuth = res.locals.userAuth;

			const card = await authorizationService.getAuthorizedResource(
				new SpouseDCService(),
				id,
				userAuth,
			);

			const spouseDCService = new SpouseDCService();
			spouseDCService.validateCanUpdate(card, userAuth.role);

			const updatedDocument = await new SpouseDCService().update(id, data);

			return res.status(HttpStatusCode.Ok).json({
				message: SUCCESS_MESSAGE.UPDATE_SUCCESS_MESSAGE,
				data: updatedDocument,
			});
		} catch (error: any) {
			return res.status(error.status).json({
				message: error.message,
				details: error.details,
			});
		}
	}

	async attachOtherFiles(req: Request<{}, {}, AttachFileSpouseDCInput>, res: Response) {
		try {
			const { spouseDCId } = req.body;
			const userAuth = res.locals.userAuth;

			const card = await authorizationService.getAuthorizedResource(
				new SpouseDCService(),
				spouseDCId,
				userAuth,
			);
			if (!card.spouseDCFiles || !card.spouseDCFiles?.id) {
				return res.status(HttpStatusCode.NotFound).json({
					message: ERROR_MESSAGE.NOT_FOUND_MESSAGE,
				});
			}
			const spouseFiles = await new SpouseDCFileRepo().findById(card.spouseDCFiles.id);

			if (!spouseFiles) {
				return res.status(HttpStatusCode.NotFound).json({
					message: ERROR_MESSAGE.NOT_FOUND_MESSAGE,
				});
			}

			let photoKey = spouseFiles.photoKey;
			let passportKey = spouseFiles.passportKey;
			let amKey = spouseFiles.amKey;

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
				deletePromises.push(deleteFile(spouseFiles.passportKey));

				passportKey = await uploadFile(
					`cartesDiplomatique/${card.id}/${generateUUID()}`,
					req.files['passport'][0],
				);
			}

			if ('am' in req.files) {
				deletePromises.push(deleteFile(spouseFiles.amKey));

				amKey = await uploadFile(
					`cartesDiplomatique/${card.id}/${generateUUID()}`,
					req.files['am'][0],
				);
			}

			if ('photo' in req.files) {
				if (spouseFiles.photoKey) {
					deletePromises.push(deleteFile(spouseFiles.photoKey));
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
				if (spouseFiles.othersKey) { /* empty */ }
				const existingOtherFiles = spouseFiles.getDataValue('othersKey') ?? [];
				spouseFiles.setDataValue('othersKey', [...existingOtherFiles, ...uploadedOtherFileKeys]);
			}

			await new SpouseDCFileRepo().update(spouseFiles.id, {
				passportKey,
				amKey,
				photoKey,
				othersKey: spouseFiles.getDataValue('othersKey'),
			});
			if (deletePromises.length !== 0) {
				await Promise.all(deletePromises);
			}
			return res.status(HttpStatusCode.Ok).json({
				message: SUCCESS_MESSAGE.UPDATE_SUCCESS_MESSAGE,
			});
		} catch (error: any) {
			return res.status(error.status).json({
				message: error.message,
				details: error.details,
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
				new SpouseDCService(),
				id,
				userAuth,
			);
			if (!card.spouseDCFiles || !card.spouseDCFiles.id) {
				return res.status(HttpStatusCode.NotFound).json({
					message: ERROR_MESSAGE.NOT_FOUND_MESSAGE,
				});
			}
			const spouseFiles = await new SpouseDCFileRepo().findById(card.spouseDCFiles.id);

			if (!spouseFiles) {
				return res.status(HttpStatusCode.NotFound).json({
					message: ERROR_MESSAGE.NOT_FOUND_MESSAGE,
				});
			}
			const deletePromises: Promise<string>[] = [];
			const deleteFile = async (fileKey: string): Promise<string> => {
				return await new FileService().deleteFile(fileKey);
			};

			if (spouseFiles.othersKey && spouseFiles.othersKey?.length > 0) {
				deletePromises.push();
				for (const file of fileKeys) {
					deletePromises.push(deleteFile(file));
					spouseFiles.othersKey = spouseFiles.othersKey.filter((x) => x !== file);
				}
			}
			await new SpouseDCFileRepo().update(spouseFiles.id, {
				othersKey: spouseFiles.othersKey,
			});
			await Promise.all(deletePromises);
			return res.status(HttpStatusCode.Ok).json({
				message: SUCCESS_MESSAGE.UPDATE_SUCCESS_MESSAGE,
			});
		} catch (error: any) {
			return res.status(error.status).json({
				message: error.message,
				details: error.details,
			});
		}
	}

	async pointFocalValidation(req: Request<GetByIdInput>, res: Response) {
		try {
			const { id } = req.params;

			const currentUser = res.locals.userAuth;

			const card = await new SpouseDCService().getOne({
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

			const updatedDocument = await new SpouseDCService().update(id, {
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
			return res.status(error.status).json({
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

			const card = await new SpouseDCService().getById(id);
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

			const updatedDocument = await new SpouseDCService().update(id, data);

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
			return res.status(error.status).json({
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

			const card = await new SpouseDCService().getById(id);
			if (!card)
				{return res.status(HttpStatusCode.NotFound).json({ message: 'Carte non trouvable' });}

			if (data.documentStage === ESuperAdminDocumentState.CONFIRMED) {
				if (!card.ownerDiplomaticCard) {
					return res.status(HttpStatusCode.BadRequest).json({
						message: 'Carte du titulaire non trouvée',
					});
				}
				if (
					card.ownerDiplomaticCard.documentStage !== EDocumentState.CONFIRMED &&
					card.ownerDiplomaticCard.documentStage !== EDocumentState.PRINTED
				) {
					return res.status(HttpStatusCode.BadRequest).json({
						message: "La carte du titulaire n'a pas été confirmée",
					});
				}
				const validity = card.ownerDiplomaticCard.dateEndOfMission;
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
			const updatedDocument = await new SpouseDCService().update(id, {
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
			return res.status(error.status).json({
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
				SpouseDCService,
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
			return res.status(error.status).json({
				message: error.message,
				details: error.details,
			});
		}
	}

	async setPrintSpouseDC(
		req: Request<PrintSpouseDCSchema['params'], {}, PrintSpouseDCSchema['body']>,
		res: Response,
	) {
		try {
			const { id } = req.params;
			const data = req.body;
			const userAuth = res.locals.userAuth;

			const card = await authorizationService.getAuthorizedResource(
				new SpouseDCService(),
				id,
				userAuth,
			);

			const spouseDCService = new SpouseDCService();
			spouseDCService.validateCanPrint(card);

			const updatedDocument = await spouseDCService.update(id, {
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

	async undoPrintOwnerDC(req: Request<PrintSpouseDCSchema['params'], {}, {}>, res: Response) {
		try {
			const { id } = req.params;

			const card = await new SpouseDCService().getById(id);

			if (!card) {
				return res.status(HttpStatusCode.NotFound).json({
					message: ERROR_MESSAGE.NOT_FOUND_MESSAGE,
				});
			}

			const spouseDCService = new SpouseDCService();
			spouseDCService.validateCanUndoPrint(card);

			const updatedDocument = await spouseDCService.update(id, {
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

	// async renewCard(req: Request<{}, {}, RequestDCDuplicataInput>, res: Response) {
	// 	try {
	// 		const data = req.body;
	// 		const user = res.locals.userAuth;
	// 		const card = await new SharedDCController().getDCByPreviousIdHelper(
	// 			data.previousDCId,
	// 			user,
	// 			SpouseDCService,
	// 		);

	// 		if (card.documentStage !== EDocumentState.CONFIRMED) {
	// 			res.status(HttpStatusCode.Forbidden).json({ message: 'Carte à renouveller non confirmé!' });
	// 		}

	// 		if (!card) {
	// 			return res.status(HttpStatusCode.NotFound).json({
	// 				message: ERROR_MESSAGE.NOT_FOUND_MESSAGE,
	// 			});
	// 		}
	// 		const code = user.getDataValue('organism').code;
	// 		const newCardNumber = await generateDCCardNumber(code);

	// 		const newCard = await new SpouseDCService().save({
	// 			firstName: card.firstName,
	// 			lastName: card.lastName,
	// 			email: card.email ?? '',
	// 			phone: card.phone ?? '',
	// 			gender: card.gender,
	// 			dateOfBirth: new Date(card.dateOfBirth),
	// 			placeOfBirth: card.placeOfBirth,
	// 			citizenship: card.citizenship,
	// 			countryOfBirth: card.countryOfBirth,
	// 			travellingNumber: card.travellingNumber,
	// 			deliverAt: card.deliverAt,
	// 			deliverBy: card.deliverBy,
	// 			deliverThe: card.deliverThe,
	// 			travellingTitleType: card.travellingTitleType,
	// 			travellingTitleValidUntil: card.travellingTitleValidUntil,
	// 			creatorId: user.id,
	// 			cardNumber: newCardNumber ?? `${code}-1-1-2024`,
	// 			ownerDiplomaticCardId: card.ownerDiplomaticCardId,
	// 			organismId: user.organismId,
	// 			demandType: EDemandType.RENOUVELLEMENT,
	// 			previousCardNumber: card.cardNumber,
	// 		});

	// 		await new SpouseDCFileService().save({
	// 			spouseDCId: newCard.id,
	// 			passportKey: card.childDCFiles.passportKey,
	// 			photoKey: card.childDCFiles.photoKey,
	// 			amKey: card.childDCFiles.amKey,
	// 			othersKey: card.childDCFiles.otherfilesKey,
	// 		});

	// 		await new SpouseDCService().update(card.id, { expired: true, validUntil: null });

	// 		return res.status(HttpStatusCode.Ok).json({
	// 			message: SUCCESS_MESSAGE.CREATION_SUCCESS_MESSAGE,
	// 			data: newCard,
	// 		});
	// 	} catch (error: any) {
	// 		return res.status(HttpStatusCode.InternalServerError).json({
	// 			message: error.message,
	// 		});
	// 	}
	// }

	async setReturned(req: Request<GetByIdInput>, res: Response) {
		try {
			const { id } = req.params;
			const userAuth = res.locals.userAuth;

			const card = await authorizationService.getAuthorizedResource(
				new SpouseDCService(),
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

			const updatedCard = await new SpouseDCService().update(id, {
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

export default new SpouseDCController();
