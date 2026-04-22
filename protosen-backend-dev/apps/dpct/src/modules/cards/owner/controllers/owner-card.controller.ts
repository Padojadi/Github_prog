import { Request, Response } from 'express';
import { HttpStatusCode } from 'axios';

import {
  CreateOwnerDCInput,
  GetOwnersDCInput,
  OwnerDCbYIdInput,
  PrintOwnerDCSchema,
  UpdateOwnerDCInput,
} from '../dtos/owner-card.dto';
import { FileService } from '../../../../shared/services/file.service';
import {
  AttachFileOwnerDCInput,
  DeleteFileInput,
  GeneratePresignedURLInput,
} from '../../../../shared/schemas/file.schema';
import { OwnerDCService } from '../services/owner-card.service';
import { OwnerDCFileService } from '../services/owner-card-file.service';
import { generateDCCardNumber, generateUUID } from '../../../../shared/utils/functions';
import { SharedDCService } from '../../../../shared/services/sharedDC.service';
import {
  AdminValidateDocumentInput,
  GetByCardNumberInput,
  GetByIdInput,
  SuperAdminValidateDocumentInput,
} from '../../../../shared/schemas/public.schemas';
import { OwnerDCFileRepo } from '../repositories/owner-card-file.repository';
import authorizationService from '../../../../shared/services/authorization.service';
import { EDemandType, EDocumentState } from '@modules/cards/types';
import { UsersService } from '@modules/user/services/user.service';
import { AUTH_MESSAGES } from '@constants/index';
import { ERROR_MESSAGE, FILE_UPLOAD_ERROR_MESSAGE, SUCCESS_MESSAGE } from '@constants/messages';
import { CustomFile } from '@shared/types';
import { RoleEnum } from '@modules/user/types';
import SharedDCController from '@shared/controllers/sharedDC.controller';

const applicant = 'Titulaire';

class OwnerDCController {
  async create(req: Request<{}, {}, CreateOwnerDCInput>, res: Response) {
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

      const payload = {
        title: data.title,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email ?? '',
        phone: data.phone ?? '',
        matrimonialStatus: data.matrimonialStatus,
        gender: data.gender,
        dateOfBirth: new Date(data.dateOfBirth),
        placeOfBirth: data.placeOfBirth,
        citizenship: data.citizenship,
        countryOfBirth: data.countryOfBirth,
        adressSenegal: data.adressSenegal,
        grade: data.grade,
        personReplaced: data.personReplaced ?? '',
        jobFunction: data.jobFunction,
        travellingNumber: data.travellingNumber,
        deliverAt: data.deliverAt,
        deliverBy: data.deliverBy,
        deliverThe: data.deliverThe,
        issueDate: data.issueDate,
        travellingTitleType: data.travellingTitleType,
        dateTakingOffice: new Date(data.dateTakingOffice),
        dateArrivalSenegal: new Date(data.dateArrivalSenegal),
        travellingTitleValidUntil: new Date(data.travellingTitleValidUntil),
        dateEndOfMission: data.dateEndOfMission ? new Date(data.dateEndOfMission) : null,
        lastCityAbroad: data.lastCityAbroad,
        lastCountryAbroad: data.lastCountryAbroad,
        latestOfWorkCountry: data.latestOfWorkCountry,
        latestWorkStructure: data.latestWorkStructure,
        lastestWorkDate: new Date(data.lastestWorkDate),
        lastStreetAbroad: data.lastStreetAbroad,
        creatorId: user.id,
        organismId: currentUser.organismId,
        plaque: data.plaque ?? null,
      };

      const newOwnerCard = await new OwnerDCService().save(payload);

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

  async getOwnerCard(req: Request<OwnerDCbYIdInput>, res: Response) {
    try {
      const { id } = req.params;
      const userAuth = res.locals.userAuth;

      const card = await authorizationService.getAuthorizedResource(
        new OwnerDCService(),
        id,
        userAuth,
      );

      if (card.ownerDiplomaticCardFiles) {
        const fileService = new FileService();
        const { passportKey, lcKey, photoKey, othersKey } = card.ownerDiplomaticCardFiles;

        const presignUrl = passportKey ? await fileService.getFileUrl(passportKey) : null;
        const presignUrlLC = lcKey ? await fileService.getFileUrl(lcKey) : null;
        const presignUrlPhoto = photoKey ? await fileService.getFileUrl(photoKey) : null;
        const presignUrlOthers = othersKey ? await fileService.getFilesUrl(othersKey) : [];

        const cardsWithUrls = {
          ...card.dataValues,
          passportLink: presignUrl,
          lcLink: presignUrlLC,
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

  async generatePresignedUrl(req: Request<{}, {}, GeneratePresignedURLInput>, res: Response) {
    try {
      const fileService = new FileService();
      const url = await fileService.generatePresignedUrl(req.body.fileName, req.body.fileType);
      return res.status(HttpStatusCode.Ok).json({
        message: SUCCESS_MESSAGE.CREATION_SUCCESS_MESSAGE,
        data: {
          url: url,
        },
      });
    } catch (error: any) {
      return res.status(HttpStatusCode.InternalServerError).json({
        message: error.message,
      });
    }
  }

  async attachFiles(req: Request<{}, {}, AttachFileOwnerDCInput>, res: Response) {
    try {
      const { ownerDiplomaticCardId } = req.body;
      const userAuth = res.locals.userAuth;

      const card = await authorizationService.getAuthorizedResource(
        new OwnerDCService(),
        ownerDiplomaticCardId,
        userAuth,
      );

      if (card.ownerDiplomaticCardFiles && card.ownerDiplomaticCardFiles.id) {
        return res.status(HttpStatusCode.MethodNotAllowed).json({
          message: ERROR_MESSAGE.INVALID_REQUEST,
        });
      }

      const uploadFile = async (fileKey: string, file: CustomFile): Promise<string> => {
        return await new FileService().uploadFile(fileKey, file);
      };

      const uploadPromises: Promise<string>[] = [];

      if (!req.files) {
        return res
          .status(HttpStatusCode.BadRequest)
          .json({ message: 'Veuillez inserez les fichiers requis!' });
      }

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

      if (!('lc' in req.files)) {
        return res.status(HttpStatusCode.BadRequest).json({
          message: 'Inserer une lettre de créance',
        });
      }
      uploadPromises.push(
        uploadFile(`cartesDiplomatique/${card.id}/${generateUUID()}`, req.files['lc'][0]),
      );

      const others: CustomFile[] = (req.files?.others as CustomFile[]) || [];
      for (const file of others) {
        uploadPromises.push(uploadFile(`cartesDiplomatique/${card.id}/${generateUUID()}`, file));
      }

      const [passportKey, photoKey, lcKey, ...otherfilesKey] = await Promise.all(uploadPromises);

      if (!passportKey || !photoKey || !lcKey) {
        return res.status(HttpStatusCode.BadRequest).json({
          message: FILE_UPLOAD_ERROR_MESSAGE.UPLOAD_FAILED,
        });
      }

      const newAttachedFile = await new OwnerDCFileService().save({
        ownerDiplomaticCardId: ownerDiplomaticCardId,
        passportKey: passportKey,
        photoKey: photoKey,
        lcKey: lcKey,
        othersKey: otherfilesKey, // Keep as othersKey in the DTO
      });

      return res.status(HttpStatusCode.Ok).json({
        message: SUCCESS_MESSAGE.CREATION_SUCCESS_MESSAGE,
        data: newAttachedFile,
      });
    } catch (error: any) {
      return res.status(HttpStatusCode.InternalServerError).json({
        message: error.message,
      });
    }
  }

  async getOwnersDCAsAdmin(req: Request<{}, {}, {}, GetOwnersDCInput>, res: Response) {
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

      const response = await new OwnerDCService().getOwnersDC(
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
      });
    }
  }

  async getOwnersDC(req: Request<{}, {}, {}, GetOwnersDCInput>, res: Response) {
    try {
      const { status, search, page, limit, sort, documentStage, expired, id } = req.query;
      const queryOptions: any = {
        status: status,
        search: search,
        page: page,
        limit: limit,
        sort: sort,
        documentStage: documentStage,
        expired: expired,
        id: id,
      };

      const response = await new OwnerDCService().getOwnersDC(queryOptions);
      return res.status(HttpStatusCode.Ok).json({
        message: SUCCESS_MESSAGE.FETCH_SUCCESS_MESSAGE,
        data: response,
      });
    } catch (error: any) {
      console.error('Error fetching owners DC:', error);
      return res.status(HttpStatusCode.InternalServerError).json({
        message: error.message,
      });
    }
  }

  async updateOwnerDC(
    req: Request<UpdateOwnerDCInput['params'], {}, UpdateOwnerDCInput['body']>,
    res: Response,
  ) {
    try {
      const { id } = req.params;
      const data = req.body;
      const userAuth = res.locals.userAuth;

      const card = await authorizationService.getAuthorizedResource(
        new OwnerDCService(),
        id,
        userAuth,
      );

      const ownerDCService = new OwnerDCService();
      ownerDCService.validateCanUpdate(card, userAuth.role);

      const updatedDocument = await new OwnerDCService().update(id, data);

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

  async deleteOwnerDC(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userAuth = res.locals.userAuth;

      const card = await authorizationService.getAuthorizedResource(
        new OwnerDCService(),
        id,
        userAuth,
      );

      const ownerDCService = new OwnerDCService();
      ownerDCService.validateCanDelete(card);

      // Récupérer ses fichiers associés
      const files = await new OwnerDCFileService().getAll({
        where: { ownerDiplomaticCardId: id },
      });

      await new OwnerDCService().delete(id);

      // Supression des fichiers de S3
      const deleteFile = async (fileKey: string): Promise<string> => {
        return await new FileService().deleteFile(fileKey);
      };

      const deletePromises: Promise<string>[] = [];

      for (const file of files) {
        const photoKey = file.photoKey;
        const passportKey = file.passportKey;
        const lcKey = file.lcKey;
        const othersKey = file.othersKey;

        if (photoKey) { deletePromises.push(deleteFile(photoKey)); }
        if (passportKey) { deletePromises.push(deleteFile(passportKey)); }
        if (lcKey) { deletePromises.push(deleteFile(lcKey)); }
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

  async setPrintOwnerDC(
    req: Request<PrintOwnerDCSchema['params'], {}, PrintOwnerDCSchema['body']>,
    res: Response,
  ) {
    try {
      const { id } = req.params;
      const data = req.body;
      const userAuth = res.locals.userAuth;

      const card = await authorizationService.getAuthorizedResource(
        new OwnerDCService(),
        id,
        userAuth,
      );

      const ownerDCService = new OwnerDCService();
      ownerDCService.validateCanPrint(card);

      const updatedDocument = await new OwnerDCService().update(id, {
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

  async undoPrintOwnerDC(req: Request<PrintOwnerDCSchema['params'], {}, {}>, res: Response) {
    try {
      const { id } = req.params;

      const card = await new OwnerDCService().getById(id);

      if (!card) {
        return res.status(HttpStatusCode.NotFound).json({
          message: ERROR_MESSAGE.NOT_FOUND_MESSAGE,
        });
      }

      const ownerDCService = new OwnerDCService();
      ownerDCService.validateCanUndoPrint(card);

      const updatedDocument = await new OwnerDCService().update(id, {
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

  async attachOtherFiles(req: Request<{}, {}, AttachFileOwnerDCInput>, res: Response) {
    try {
      const { ownerDiplomaticCardId } = req.body;
      const userAuth = res.locals.userAuth;

      const card = await authorizationService.getAuthorizedResource(
        new OwnerDCService(),
        ownerDiplomaticCardId,
        userAuth,
      );

      if (!card.ownerDiplomaticCardFiles || !card.ownerDiplomaticCardFiles?.id) {
        return res.status(HttpStatusCode.NotFound).json({
          message: ERROR_MESSAGE.NOT_FOUND_MESSAGE,
        });
      }

      const ownerFiles = await new OwnerDCFileRepo().findById(card.ownerDiplomaticCardFiles.id);

      if (!ownerFiles) {
        return res.status(HttpStatusCode.NotFound).json({
          message: ERROR_MESSAGE.NOT_FOUND_MESSAGE,
        });
      }
      let photoKey = ownerFiles.photoKey;
      let passportKey = ownerFiles.passportKey;
      let lcKey = ownerFiles.lcKey;

      const uploadFile = async (fileKey: string, file: CustomFile): Promise<string> => {
        return await new FileService().uploadFile(fileKey, file);
      };
      const deleteFile = async (fileKey: string): Promise<string> => {
        return await new FileService().deleteFile(fileKey);
      };

      const deletePromises: Promise<string>[] = [];
      const uploadOthersPromises: Promise<string>[] = [];

      if (!req.files) {
        return res
          .status(HttpStatusCode.BadRequest)
          .json({ message: 'Veuillez inserez les fichiers!' });
      }

      if ('passport' in req.files) {
        if (ownerFiles.passportKey) {
          deletePromises.push(deleteFile(ownerFiles.passportKey));
        }

        passportKey = await uploadFile(
          `cartesDiplomatique/${card.id}/${generateUUID()}`,
          req.files['passport'][0],
        );
      }

      if ('lc' in req.files) {
        if (ownerFiles.lcKey) {
          deletePromises.push(deleteFile(ownerFiles.lcKey));
        }

        lcKey = await uploadFile(
          `cartesDiplomatique/${card.id}/${generateUUID()}`,
          req.files['lc'][0],
        );
      }

      if ('photo' in req.files) {
        if (ownerFiles.photoKey) {
          deletePromises.push(deleteFile(ownerFiles.photoKey));
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

      let updatedOthersKey = ownerFiles.othersKey ?? [];
      if (uploadedOtherFileKeys.length > 0) {
        updatedOthersKey = [...updatedOthersKey, ...uploadedOtherFileKeys];
      }

      await new OwnerDCFileRepo().update(ownerFiles.id, {
        passportKey: passportKey,
        lcKey: lcKey,
        photoKey: photoKey,
        othersKey: updatedOthersKey,
      });

      if (deletePromises.length !== 0) {
        await Promise.all(deletePromises);
      }
      return res.status(HttpStatusCode.Ok).json({
        message: SUCCESS_MESSAGE.UPDATE_SUCCESS_MESSAGE,
      });
    } catch (error: any) {
      return res.status(error.status || HttpStatusCode.InternalServerError).json({
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
        new OwnerDCService(),
        id,
        userAuth,
      );
      if (!card.ownerDiplomaticCardFiles || !card.ownerDiplomaticCardFiles?.id) {
        return res.status(HttpStatusCode.NotFound).json({
          message: ERROR_MESSAGE.NOT_FOUND_MESSAGE,
        });
      }
      const ownerFiles = await new OwnerDCFileRepo().findById(card.ownerDiplomaticCardFiles.id);

      if (!ownerFiles) {
        return res.status(HttpStatusCode.NotFound).json({
          message: ERROR_MESSAGE.NOT_FOUND_MESSAGE,
        });
      }
      const deletePromises: Promise<string>[] = [];
      const deleteFile = async (fileKey: string): Promise<string> => {
        return await new FileService().deleteFile(fileKey);
      };

      let updatedOthersKey = ownerFiles.othersKey ?? [];
      if (ownerFiles.othersKey && ownerFiles.othersKey?.length > 0) {
        for (const file of fileKeys) {
          deletePromises.push(deleteFile(file));
          updatedOthersKey = updatedOthersKey.filter((x) => x !== file);
        }
      }

      await new OwnerDCFileRepo().update(ownerFiles.id, {
        othersKey: updatedOthersKey,
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

      const card = await new OwnerDCService().getOne({
        id: id,
        organismId: currentUser.organismId,
        creatorId: currentUser.id,
      });
      if (!card) { return res.status(HttpStatusCode.NotFound).json({ message: 'Carte non trouvable' }); }

      if (
        (card.dataValues.documentStage === EDocumentState.APPROVED && !card.expired) ||
        (card.dataValues.documentStage === EDocumentState.CONFIRMED && !card.expired)
      ) {
        return res
          .status(HttpStatusCode.BadRequest)
          .json({ message: ERROR_MESSAGE.CAN_NOT_UPDATE });
      }

      const updatedDocument = await new OwnerDCService().update(id, {
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

      const card = await new OwnerDCService().getById(id);
      if (!card) { return res.status(HttpStatusCode.NotFound).json({ message: 'Carte non trouvable' }); }

      if (
        (card.documentStage === EDocumentState.APPROVED && !card.expired) ||
        (card.documentStage === EDocumentState.CONFIRMED && !card.expired)
      ) {
        return res
          .status(HttpStatusCode.BadRequest)
          .json({ message: ERROR_MESSAGE.CAN_NOT_UPDATE });
      }

      const updatedDocument = await new OwnerDCService().update(id, data);
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

      const card = await new OwnerDCService().getById(id);
      if (!card) { return res.status(HttpStatusCode.NotFound).json({ message: 'Carte non trouvable' }); }

      if (!card.organism) {
        return res.status(HttpStatusCode.BadRequest).json({
          message: 'Organisme non trouvé',
        });
      }

      const code = card.organism.code;
      const newCardNumber = await generateDCCardNumber(code);
      const updatedDocument = await new OwnerDCService().update(id, {
        ...data,
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
        OwnerDCService,
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
        new OwnerDCService(),
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

      const updatedCard = await new OwnerDCService().update(id, {
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

export default new OwnerDCController();
