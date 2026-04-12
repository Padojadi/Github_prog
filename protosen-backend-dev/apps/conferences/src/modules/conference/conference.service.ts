import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  GetConferenceParticipantsDto,
  UpdateConferenceDto,
  UpdateConferenceRequestDto,
} from './dto/update-conference.dto';
import {
  AssignParticipantTypesDto,
  CreateConferenceDto,
  CreateConferenceRequestDto,
  GetConferenceRequestDto,
} from './dto/create-conference.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { Conference, ConferenceStatus, Prisma } from '@prisma/client';

import { api_code } from 'src/constants/api.codes';
import { PaginationMeta } from 'src/core/dtos/paginationmeta';
import { UserPermission } from 'src/constants/enum';
import { FileUploadService } from '../file-upload/file-upload.service';
import { User } from '../user/generated/user';
import sendEmail from 'src/config/mail.config';
import {
  generateConfirmationEmailHtml,
  generateReceptionEmailHtml,
} from 'src/helpers/emailHelper';
import { SearchDto } from 'src/core/dtos/search.dto';

@Injectable()
export class ConferenceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUploadService: FileUploadService,
  ) {}
  async createRequest(createDto: CreateConferenceRequestDto, user: User) {
    try {
      const conference = await this.prisma.conference.create({
        data: {
          ...createDto,
          creatorId: user.id,
          lastStatus: ConferenceStatus.PENDING,
          statusHistories: {
            create: {
              status: ConferenceStatus.PENDING,
              changedByID: user.id,
            },
          },
          institutionId: user.organismId,
        },
      });

      const htmlContent = generateReceptionEmailHtml(conference);

      sendEmail({
        to: conference.email,
        subject: 'Demande de conference reçue',
        html: htmlContent,
      });
      return conference;
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_203);
    }
  }

  async publish(createDto: CreateConferenceDto, user: User) {
    try {
      const oldConference = await this.prisma.conference.findFirst({
        where: { id: createDto.id },
        include: {
          conferenceAccommodations: true,
        },
      });

      if (!oldConference) {
        throw new BadRequestException(api_code.MSG_205);
      }

      const latestStatus = oldConference.lastStatus;
      const isRequiredStatus = latestStatus === ConferenceStatus.CONFIRMED;

      if (!isRequiredStatus) {
        throw new BadRequestException(api_code.MSG_215);
      }

      if (
        !createDto.accommodationIds &&
        oldConference.conferenceAccommodations.length === 0
      ) {
        throw new BadRequestException(api_code.MSG_232);
      }

      let validAccommodationIds: string[] = [];

      if (createDto.accommodationIds) {
        const existingAccommodations = await this.prisma.accommodation.findMany(
          {
            where: { id: { in: createDto.accommodationIds } },
            select: { id: true },
          },
        );

        validAccommodationIds = existingAccommodations.map((a) => a.id);

        if (
          validAccommodationIds.length !== createDto.accommodationIds.length
        ) {
          throw new BadRequestException(api_code.MSG_233);
        }
      }

      await this.prisma.$transaction(async (tx) => {
        await tx.conference.update({
          where: { id: createDto.id },
          data: {
            description: createDto.description,
            lastStatus: ConferenceStatus.PUBLISHED,
            statusHistories: {
              create: {
                status: ConferenceStatus.PUBLISHED,
                changedByID: user.id,
              },
            },
          },
        });

        if (validAccommodationIds.length > 0) {
          await tx.conferenceAccommodation.deleteMany({
            where: { conferenceId: createDto.id },
          });

          await tx.conferenceAccommodation.createMany({
            data: validAccommodationIds.map((accommodationId) => ({
              conferenceId: createDto.id,
              accommodationId,
            })),
          });
        }
      });

      const htmlContent = generateConfirmationEmailHtml(oldConference);

      sendEmail({
        to: oldConference.email,
        subject: 'Conference publiée',
        html: htmlContent,
      });
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new UnprocessableEntityException(api_code.MSG_221);
    }
  }

  async update(id: string, dto: UpdateConferenceDto) {
    try {
      const oldConference = await this.prisma.conference.findFirst({
        where: { id: id },
        include: {
          statusHistories: {
            orderBy: { changedAt: 'desc' },
            take: 1,
          },
        },
      });

      if (!oldConference) {
        throw new NotFoundException(api_code.MSG_205);
      }

      const latestStatus = oldConference.statusHistories[0].status;
      const isRequiredStatus = latestStatus === ConferenceStatus.CONFIRMED;

      if (!isRequiredStatus) {
        throw new BadRequestException(api_code.MSG_215);
      }

      let validAccommodationIds: string[] = [];

      if (dto.accommodationIds) {
        const existingAccommodations = await this.prisma.accommodation.findMany(
          {
            where: { id: { in: dto.accommodationIds } },
            select: { id: true },
          },
        );

        validAccommodationIds = existingAccommodations.map((a) => a.id);

        if (validAccommodationIds.length !== dto.accommodationIds.length) {
          throw new BadRequestException(api_code.MSG_233);
        }
      }

      await this.prisma.$transaction(async (tx) => {
        // Mise à jour de la conférence
        await tx.conference.update({
          where: { id },
          data: {
            description: dto.description || oldConference.description,
          },
        });

        // Vérifier si accommodationIds est défini (non null)
        if (
          dto.accommodationIds !== null &&
          dto.accommodationIds !== undefined
        ) {
          // Supprimer les anciennes relations
          await tx.conferenceAccommodation.deleteMany({
            where: { conferenceId: id },
          });

          // Ajouter les nouvelles relations si le tableau n'est pas vide
          if (validAccommodationIds.length > 0) {
            await tx.conferenceAccommodation.createMany({
              data: validAccommodationIds.map((accommodationId) => ({
                conferenceId: id,
                accommodationId,
              })),
            });
          }
        }
      });
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new UnprocessableEntityException(api_code.MSG_221);
    }
  }

  async findByCreator(
    creatorId: string,
    user: User,
    params: GetConferenceRequestDto,
  ) {
    try {
      const permissions = user.accessGroup.permissions as UserPermission[];

      const paginationOptions = {};
      if (params.page !== undefined && params.limit !== undefined) {
        paginationOptions['skip'] = (params.page - 1) * params.limit; // Définir le nombre d'éléments à passer
        paginationOptions['take'] = params.limit; // Définir le nombre d'éléments à prendre
      }

      // Constructing the where clause with case insensitive search
      const searchCondition: Prisma.ConferenceWhereInput = {};

      if (params.search) {
        searchCondition.OR = [
          {
            lastName: {
              contains: params.search,
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: params.search,
              mode: 'insensitive',
            },
          },
          {
            title: {
              contains: params.search,
              mode: 'insensitive',
            },
          },
          {
            matriculeNumber: {
              contains: params.search,
              mode: 'insensitive',
            },
          },
        ];
      }

      const whereClause: Prisma.ConferenceWhereInput = {
        ...searchCondition,
        creatorId: creatorId,
      };

      if (params.status && params.status.length > 0) {
        whereClause.lastStatus = {
          in: params.status,
        };
      }

      if (params.institutionId) {
        whereClause.institutionId = params.institutionId;
      }

      if (params.startDate || params.endDate) {
        whereClause.createdAt = {};
        if (params.startDate) {
          whereClause.createdAt.gte = new Date(params.startDate);
        }
        if (params.endDate) {
          whereClause.createdAt.lte = new Date(params.endDate);
        }
      }

      if (
        ![
          UserPermission.MANAGE_CONFERENCES,
          UserPermission.ACCEPT_CONFERENCE_REQUEST,
          UserPermission.VALIDATE_CONFERENCE_REQUEST,
          UserPermission.CONFIRM_CONFERENCE_REQUEST,
        ].some((role) => permissions.includes(role))
      ) {
        if (creatorId != user.id) {
          throw new UnprocessableEntityException(api_code.MSG_211);
        }
      }

      const [paiements, totalCount] = await Promise.all([
        this.prisma.conference.findMany({
          where: whereClause,
          include: {
            statusHistories: {
              orderBy: {
                changedAt: 'desc',
              },
              take: 1, // Ne récupérer que le dernier statut
            },
            _count: {
              select: {
                participants: {
                  where: {
                    subscriptionStatus: 'PAID',
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          ...paginationOptions,
        }),
        this.prisma.conference.count({ where: whereClause }),
      ]);

      const paginationMeta = new PaginationMeta(
        params.page || 1,
        params.limit || paiements.length,
        totalCount,
      );
      return {
        ...paginationMeta,
        data: paiements,
      };
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_204);
    }
  }

  async findAccommodations(conferenceId: string) {
    try {
      return await this.prisma.conferenceAccommodation.findMany({
        where: { conferenceId },
        include: {
          accommodation: true,
        },
      });
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_217);
    }
  }

  async findAll(user: User, params: GetConferenceRequestDto) {
    try {
      const permissions = user.accessGroup.permissions as UserPermission[];

      const paginationOptions = {};
      if (params.page !== undefined && params.limit !== undefined) {
        paginationOptions['skip'] = (params.page - 1) * params.limit; // Définir le nombre d'éléments à passer
        paginationOptions['take'] = params.limit; // Définir le nombre d'éléments à prendre
      }

      // Constructing the where clause with case insensitive search
      const searchCondition: Prisma.ConferenceWhereInput = {};

      if (params.search) {
        searchCondition.OR = [
          {
            lastName: {
              contains: params.search,
              mode: 'insensitive',
            },
          },
          {
            firstName: {
              contains: params.search,
              mode: 'insensitive',
            },
          },
          {
            title: {
              contains: params.search,
              mode: 'insensitive',
            },
          },
          {
            matriculeNumber: {
              contains: params.search,
              mode: 'insensitive',
            },
          },
        ];
      }

      const whereClause: Prisma.ConferenceWhereInput = {
        ...searchCondition,
      };

      if (params.status && params.status.length > 0) {
        whereClause.lastStatus = {
          in: params.status,
        };
      }

      if (params.institutionId) {
        whereClause.institutionId = params.institutionId;
      }

      if (params.startDate || params.endDate) {
        whereClause.createdAt = {};
        if (params.startDate) {
          whereClause.createdAt.gte = new Date(params.startDate);
        }
        if (params.endDate) {
          whereClause.createdAt.lte = new Date(params.endDate);
        }
      }

      if (
        ![
          UserPermission.MANAGE_CONFERENCES,
          UserPermission.ACCEPT_CONFERENCE_REQUEST,
          UserPermission.VALIDATE_CONFERENCE_REQUEST,
          UserPermission.CONFIRM_CONFERENCE_REQUEST,
        ].some((role) => permissions.includes(role))
      ) {
        whereClause.institutionId = user.organismId;
        whereClause.creatorId = user.id;
      }

      const [conferences, totalCount] = await Promise.all([
        this.prisma.conference.findMany({
          where: whereClause,
          include: {
            statusHistories: {
              orderBy: {
                changedAt: 'desc',
              },
            },
            _count: {
              select: {
                participants: {
                  where: {
                    subscriptionStatus: 'PAID',
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          ...paginationOptions,
        }),
        this.prisma.conference.count({ where: whereClause }),
      ]);

      const paginationMeta = new PaginationMeta(
        params.page || 1,
        params.limit || conferences.length,
        totalCount,
      );
      return {
        ...paginationMeta,
        data: conferences,
      };
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_204);
    }
  }

  findOne(id: string, user: User): Promise<Conference | null> {
    try {
      const permissions = user.accessGroup.permissions as UserPermission[];

      const whereClause: Prisma.ConferenceWhereInput = {
        id: id,
      };
      if (
        ![
          UserPermission.MANAGE_CONFERENCES,
          UserPermission.ACCEPT_CONFERENCE_REQUEST,
          UserPermission.VALIDATE_CONFERENCE_REQUEST,
          UserPermission.CONFIRM_CONFERENCE_REQUEST,
        ].some((role) => permissions.includes(role))
      ) {
        whereClause.institutionId = user.organismId;
        whereClause.creatorId = user.id;
      }

      const result = this.prisma.conference.findFirst({
        where: whereClause,
        include: {
          statusHistories: {
            orderBy: {
              changedAt: 'desc',
            },
            take: 1,
          },
          _count: {
            select: {
              participants: {
                where: {
                  subscriptionStatus: 'PAID',
                },
              },
            },
          },
        },
      });
      return result;
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_205);
    }
  }

  async updateRequest(
    id: string,
    updateConferenceDto: UpdateConferenceRequestDto,
    user: User,
  ) {
    try {
      const oldConference = await this.prisma.conference.findFirst({
        where: { id },
        include: {
          statusHistories: {
            orderBy: { changedAt: 'desc' },
            take: 1,
          },
        },
      });

      if (!oldConference) {
        throw new NotFoundException(api_code.MSG_205);
      }

      const latestStatus = oldConference.statusHistories[0].status;
      const isForbiddenStatus =
        latestStatus === ConferenceStatus.ACCEPTED ||
        latestStatus === ConferenceStatus.VALIDATED ||
        latestStatus === ConferenceStatus.CONFIRMED ||
        latestStatus === ConferenceStatus.REJECTED_PERMANENTLY ||
        latestStatus === ConferenceStatus.PUBLISHED;

      if (oldConference.creatorId !== user.id) {
        throw new BadRequestException(api_code.MSG_211);
      } else if (isForbiddenStatus) {
        throw new BadRequestException(api_code.MSG_215);
      }

      // Détection des fichiers à supprimer
      const filesToDelete = [
        updateConferenceDto.budgetDoc !== oldConference.budgetDoc
          ? oldConference.budgetDoc
          : null,
        updateConferenceDto.themeDoc !== oldConference.themeDoc
          ? oldConference.themeDoc
          : null,
      ].filter(Boolean); // Supprime les valeurs null

      // Mise à jour de la conférence
      const updatedConference = await this.prisma.conference.update({
        where: { id },
        data: {
          ...updateConferenceDto,
          ...(latestStatus !== ConferenceStatus.PENDING
            ? { lastStatus: ConferenceStatus.PENDING }
            : {}),
          statusHistories:
            latestStatus !== ConferenceStatus.PENDING
              ? {
                  create: {
                    changedByID: user.id,
                    status: ConferenceStatus.PENDING,
                  },
                }
              : null,
        },
      });

      // Suppression des fichiers inutiles
      filesToDelete.forEach((file) => this.fileUploadService.deleteFile(file));

      return updatedConference;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new UnprocessableEntityException(api_code.MSG_206);
    }
  }

  async remove(id: string, userId: string) {
    const conference = await this.prisma.conference.findFirst({
      where: { creatorId: userId, id: id },
      include: {
        statusHistories: {
          orderBy: {
            changedAt: 'desc',
          },
          take: 1,
        },
      },
    });
    if (!conference || conference.statusHistories.length === 0) {
      throw new NotFoundException(api_code.MSG_205);
    }
    if (conference.statusHistories[0].status !== ConferenceStatus.PENDING) {
      throw new BadRequestException(api_code.MSG_208);
    }
    try {
      const data = await this.prisma.conference.delete({
        where: { id: id },
      });
      return data;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new UnprocessableEntityException(api_code.MSG_207);
    }
  }

  async findParticipants(
    conferenceId: string,
    params: GetConferenceParticipantsDto,
  ) {
    try {
      const paginationOptions = {};
      if (params.page !== undefined && params.limit !== undefined) {
        paginationOptions['skip'] = (params.page - 1) * params.limit; // Définir le nombre d'éléments à passer
        paginationOptions['take'] = params.limit; // Définir le nombre d'éléments à prendre
      }

      // Constructing the where clause with case insensitive search
      const searchCondition: Prisma.ParticipantWhereInput = {};

      if (params.search) {
        searchCondition.OR = [
          {
            lastName: {
              contains: params.search,
              mode: 'insensitive',
            },
          },
          {
            firstName: {
              contains: params.search,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: params.search,
              mode: 'insensitive',
            },
          },
          {
            customFunction: {
              contains: params.search,
              mode: 'insensitive',
            },
          },
        ];
      }

      const whereClause: Prisma.ParticipantWhereInput = {
        conferenceId,
        ...searchCondition,
      };

      if (params.status && params.status.length > 0) {
        whereClause.subscriptionStatus = {
          in: params.status,
        };
      }

      const [conferences, totalCount] = await Promise.all([
        this.prisma.participant.findMany({
          where: whereClause,
          include: {
            ticket: true,
            conferenceAccommodation: true,
            conferenceParticipantType: {
              include: {
                participantType: true,
              },
            },
            functionModel: true,
            supportOptions: {
              include: { supportOption: true },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          omit: { loginCode: true },
          ...paginationOptions,
        }),
        this.prisma.participant.count({ where: whereClause }),
      ]);

      const paginationMeta = new PaginationMeta(
        params.page || 1,
        params.limit || conferences.length,
        totalCount,
      );
      console.log(conferences);
      return {
        ...paginationMeta,
        data: conferences.map((participant) => ({
          ...participant,
          conferenceParticipantType: participant.conferenceParticipantType
            ? {
                id: participant.conferenceParticipantType.id,
                participantTypeId:
                  participant.conferenceParticipantType.participantTypeId,
                label:
                  participant.conferenceParticipantType.participantType.label,
                description:
                  participant.conferenceParticipantType.participantType
                    .description,
                requiresValidation:
                  participant.conferenceParticipantType.requiresValidation,
                createdAt: participant.conferenceParticipantType.createdAt,
              }
            : null,
        })),
      };
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_204);
    }
  }

  async assignParticipantTypes(dto: AssignParticipantTypesDto) {
    try {
      const { conferenceId, participantTypes } = dto;

      // Vérifier si la conférence existe
      const conference = await this.prisma.conference.findUnique({
        where: { id: conferenceId },
      });
      if (!conference) {
        throw new NotFoundException(api_code.MSG_205);
      }

      const participantTypeIds = participantTypes.map(
        (p) => p.participantTypeId,
      );

      // Vérifier si tous les participantTypes existent
      const existingTypes = await this.prisma.participantType.findMany({
        where: { id: { in: participantTypeIds } },
        select: { id: true },
      });

      const missing = participantTypeIds.filter(
        (id) => !existingTypes.find((e) => e.id === id),
      );

      if (missing.length > 0) {
        throw new UnprocessableEntityException({
          code: api_code.MSG_259.code,
          message: `The following participantTypeIds do not exist: ${missing.join(', ')}`,
        });
      }

      // Transaction sécurisée
      await this.prisma.$transaction(async (tx) => {
        // Supprimer les anciens liens
        await tx.conferenceParticipantType.deleteMany({
          where: { conferenceId },
        });

        // Créer les nouveaux liens
        await tx.conferenceParticipantType.createMany({
          data: participantTypes.map(
            ({ participantTypeId, requiresValidation }) => ({
              conferenceId,
              participantTypeId,
              requiresValidation,
            }),
          ),
          skipDuplicates: true,
        });
      });

      return { message: 'Participant types assigned successfully.' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnprocessableEntityException
      ) {
        throw error;
      }
      throw new UnprocessableEntityException(api_code.MSG_259);
    }
  }

  async getAssignedParticipantTypes(conferenceID: string, dto: SearchDto) {
    try {
      const { search, page, limit } = dto;

      const skip = (page - 1) * limit;

      const where: Prisma.ConferenceParticipantTypeWhereInput = {
        conferenceId: conferenceID,
        participantType: {
          label: search ? { contains: search, mode: 'insensitive' } : undefined,
        },
      };

      const [total, items] = await this.prisma.$transaction([
        this.prisma.conferenceParticipantType.count({ where }),
        this.prisma.conferenceParticipantType.findMany({
          where,
          ...(limit && { skip, take: limit }),
          include: {
            participantType: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
      ]);

      return {
        meta: new PaginationMeta(page || 1, limit || items.length, total),
        items: items.map((item) => ({
          id: item.id,
          participantTypeId: item.participantTypeId,
          label: item.participantType.label,
          description: item.participantType.description,
          requiresValidation: item.requiresValidation,
          createdAt: item.createdAt,
        })),
      };
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_260);
    }
  }
}
