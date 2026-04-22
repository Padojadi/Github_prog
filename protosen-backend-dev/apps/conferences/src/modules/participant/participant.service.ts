import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { api_code } from 'src/constants/api.codes';
import { SubscriptionStatus } from '@prisma/client';
import { User } from '../user/generated/user';
import { RejectSubscriptionDto } from './dto/update-participant.dto';
import {
  generateAcceptedEmailHtml,
  generatePaiementConfirmationHtml,
  generateRejectedEmailHtml,
} from 'src/helpers/emailHelper';
import sendEmail from 'src/config/mail.config';
import { checkout } from 'src/config/paydunya.config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { generateShortCode } from 'src/helpers/util';
import { FileUploadService } from '../file-upload/file-upload.service';
@Injectable()
export class ParticipantService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async createParticipant(
    avatar: Express.Multer.File,
    dto: CreateParticipantDto,
  ) {
    try {
      // Vérification de l'existence de la conférence
      const conference = await this.prisma.conference.findUnique({
        where: { id: dto.conferenceId },
      });

      if (!conference) {
        throw new NotFoundException(api_code.MSG_205);
      }

      if (dto.functionId) {
        // Vérification de l'existence de la fonction si elle est fournie
        const functionExists = await this.prisma.functionModel.findUnique({
          where: { id: dto.functionId },
        });
        if (!functionExists) {
          throw new NotFoundException({
            ...api_code.MSG_228,
            message: 'Fonction non trouvée',
          });
        }
      }
      if (dto.supportOptionIds && dto.supportOptionIds.length > 0) {
        const supportOptions = await this.prisma.supportOption.findMany({
          where: { id: { in: dto.supportOptionIds } },
          select: { id: true },
        });
        if (supportOptions.length !== dto.supportOptionIds.length) {
          throw new NotFoundException({
            ...api_code.MSG_228,
            message: 'Une ou plusieurs options de support non trouvées',
          });
        }
      }
      const c_participantTypeExists =
        await this.prisma.conferenceParticipantType.findUnique({
          where: { id: dto.conferenceParticipantTypeId },
        });
      if (dto.conferenceParticipantTypeId) {
        // Vérification de l'existence du type de participant à la conférence
        if (!c_participantTypeExists) {
          throw new NotFoundException({
            ...api_code.MSG_228,
            message: 'Type de participant à la conférence non trouvé',
          });
        }
      }

      const x = await this.prisma.participant.findFirst({
        where: {
          conferenceId: dto.conferenceId,
          email: dto.email,
        },
      });

      if (x) {
        throw new BadRequestException(api_code.MSG_239);
      }

      // Vérification de l'existence du ticket et son association avec la conférence
      const ticket = await this.prisma.ticket.findUnique({
        where: { id: dto.ticketId },
        include: { conference: true },
      });

      if (!ticket) {
        throw new NotFoundException(api_code.MSG_229);
      }

      if (ticket.conferenceId !== dto.conferenceId) {
        throw new BadRequestException(api_code.MSG_230);
      }

      // Vérification de l'existence et de la validité de l'hébergement, si fourni
      let conferenceAccommodation = null;
      if (dto.conferenceAccommodationId) {
        conferenceAccommodation =
          await this.prisma.conferenceAccommodation.findUnique({
            where: { id: dto.conferenceAccommodationId },
            include: { conference: true },
          });

        if (!conferenceAccommodation) {
          throw new NotFoundException(api_code.MSG_231);
        }

        if (conferenceAccommodation.conferenceId !== dto.conferenceId) {
          throw new BadRequestException(api_code.MSG_232);
        }
      }

      const avatarUrl = await this.fileUploadService.uploadFile(
        avatar,
        'conferences',
      );

      // Création du participant après validation
      const participant = await this.prisma.participant.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          gender: dto.gender,
          organisation: dto.organisation,
          postalCode: dto.postalCode,
          city: dto.city,
          country: dto.country,
          visaNeeded: dto.visaNeeded === 'true' ? true : false,
          acceptTerms: dto.acceptTerms,
          email: dto.email,
          address: dto.address,
          phone: dto.phone,
          ticketId: dto.ticketId,
          conferenceId: dto.conferenceId,
          identityType: dto.identityType,
          identityNumber: dto.identityNumber,
          identityIssueDate: dto.identityIssueDate,
          dateOfBirth: dto.dateOfBirth,
          nationality: dto.nationality,
          avatarUrl: avatarUrl,
          ...(dto.functionId
            ? { functionId: dto.functionId }
            : dto.customFunction
              ? { customFunction: dto.customFunction }
              : {}),
          ...(dto.supportOptionIds && dto.supportOptionIds.length > 0
            ? {
                supportOptions: {
                  create: dto.supportOptionIds.map((id) => ({
                    supportOptionId: id,
                  })),
                },
              }
            : {}),
          conferenceParticipantTypeId: dto.conferenceParticipantTypeId,
          ...(dto.conferenceAccommodationId
            ? { conferenceAccommodationId: dto.conferenceAccommodationId }
            : dto.customAccommodation
              ? { customAccommodation: dto.customAccommodation }
              : {}),
          subscriptionStatus: 'PROCESSING',
          subscriptionStatusHistory: {
            create: {
              status: 'PROCESSING',
            },
          },
        },
      });
      return {
        participant,
        requiresValidation: c_participantTypeExists.requiresValidation,
      };
    } catch (error) {
      console.log('createParticipant error', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new UnprocessableEntityException(api_code.MSG_228);
    }
  }

  async findOne(id: string) {
    try {
      const result = await this.prisma.participant.findUnique({
        where: { id },
        include: {
          ticket: true,
          conference: {
            include: {
              conferenceAccommodations: {
                include: { accommodation: true },
              },
            },
          },
          conferenceParticipantType: {
            include: {
              participantType: true,
            },
          },
          functionModel: true,
          supportOptions: {
            include: { supportOption: true },
          },
          conferenceAccommodation: {
            include: { accommodation: true },
          },
          subscriptionStatusHistory: {
            orderBy: { changedAt: 'desc' },
          },
        },
        omit: { loginCode: true },
      });

      return {
        ...result,
        conferenceParticipantType: {
          id: result.conferenceParticipantType.id,
          participantTypeId: result.conferenceParticipantType.participantTypeId,
          label: result.conferenceParticipantType.participantType.label,
          description:
            result.conferenceParticipantType.participantType.description,
          requiresValidation:
            result.conferenceParticipantType.requiresValidation,
          createdAt: result.conferenceParticipantType.createdAt,
        },
      };
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_238);
    }
  }

  async acceptSubscription(id: string, user: User | null) {
    try {
      const participant = await this.prisma.participant.findUnique({
        where: { id: id },
        include: { ticket: true, conference: true },
      });
      if (!participant) {
        throw new UnprocessableEntityException(api_code.MSG_205);
      }

      if (participant.subscriptionStatus !== SubscriptionStatus.PROCESSING) {
        throw new UnprocessableEntityException(api_code.MSG_215);
      }

      const status =
        participant.ticket.price === 0
          ? SubscriptionStatus.PAID
          : SubscriptionStatus.PENDING_PAYMENT;

      await this.prisma.participant.update({
        where: { id: id },
        data: {
          subscriptionStatus: status,
          code: status === SubscriptionStatus.PAID ? generateShortCode() : null,
          subscriptionStatusHistory: {
            create: {
              status: status,
              changedByID: user?.id,
            },
          },
        },
      });

      const htmlContent = generateAcceptedEmailHtml({
        title: participant.conference.title,
        startDate: participant.conference.startDate,
        endDate: participant.conference.endDate,
        location: participant.conference.location,
        paymentUrl:
          participant.ticket.price === 0
            ? null
            : process.env.APP_URL +
              '/conferences/participant-gateway?participant=' +
              participant.id,
        ticketUrl:
          participant.ticket.price === 0
            ? process.env.APP_URL +
              '/conferences/participant-gateway?tab=ticket&participant=' +
              participant.id
            : null,
      });

      await sendEmail({
        to: participant.email,
        subject: 'Inscription confirmée',
        html: htmlContent,
      });
      return { message: 'Inscription acceptée avec succès' };
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_212);
    }
  }

  async rejectSubscription(id: string, dto: RejectSubscriptionDto, user: User) {
    try {
      const participant = await this.prisma.participant.findUnique({
        where: { id: id },
        include: { ticket: true, conference: true },
      });
      if (!participant) {
        throw new UnprocessableEntityException(api_code.MSG_205);
      }

      if (participant.subscriptionStatus !== SubscriptionStatus.PROCESSING) {
        throw new UnprocessableEntityException(api_code.MSG_215);
      }
      this.prisma.participant.update({
        where: { id: id },
        data: {
          subscriptionStatus: SubscriptionStatus.REJECTED,
          subscriptionStatusHistory: {
            create: {
              status: SubscriptionStatus.REJECTED,
              changedByID: user.id,
              rejectionReason: dto.rejectionReason,
            },
          },
        },
      });
      const htmlContent = generateRejectedEmailHtml({
        title: participant.conference.title,
        startDate: participant.conference.startDate,
        endDate: participant.conference.endDate,
        location: participant.conference.location,
        reason: dto.rejectionReason,
      });

      await sendEmail({
        to: participant.email,
        subject: 'Inscription rejetée',
        html: htmlContent,
      });
      return { message: 'Inscription rejetée avec succès' };
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_213);
    }
  }

  async getPaymentUrl(id: string) {
    try {
      const participant = await this.prisma.participant.findUnique({
        where: { id },
        include: { ticket: true, conference: true },
      });
      if (!participant) {
        throw new UnprocessableEntityException(api_code.MSG_205);
      }

      if (
        participant.subscriptionStatus !== SubscriptionStatus.PENDING_PAYMENT
      ) {
        throw new UnprocessableEntityException(api_code.MSG_215);
      }

      // L'ajout d'éléments à votre facture est très basique.
      // Les paramètres attendus sont nom du produit, la quantité, le prix unitaire,
      // le prix total et une description optionelle.
      checkout.addItem(
        participant.conference.title,
        1,
        participant.ticket.price,
        participant.ticket.price,
        participant.ticket.name + ' - ' + participant.ticket.description,
      );
      checkout.totalAmount = participant.ticket.price;

      checkout.addCustomData('participant_id', participant.id);

      await checkout.create();

      await this.prisma.participant.update({
        where: { id },
        data: {
          paydunyatoken: checkout.token,
        },
      });

      return { url: checkout.url };
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_214);
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async syncPaydunyatokenStatus() {
    try {
      const participants = await this.prisma.participant.findMany({
        where: {
          AND: [
            { paydunyatoken: { not: null } },
            { subscriptionStatus: SubscriptionStatus.PENDING_PAYMENT },
          ],
        },
        include: { conference: true },
      });
      participants.map(async (participant) => {
        // Le statut du paiement peut être soit completed, pending, cancelled
        await checkout.confirm(participant.paydunyatoken);
        if (checkout.status === 'completed') {
          await this.prisma.participant.update({
            where: { id: participant.id },
            data: {
              subscriptionStatus: SubscriptionStatus.PAID,
              code: generateShortCode(),
              subscriptionStatusHistory: {
                create: {
                  status: SubscriptionStatus.PAID,
                },
              },
            },
          });
          const htmlContent = generatePaiementConfirmationHtml({
            conferenceName: participant.conference.title,
            startDate: participant.conference.startDate,
            endDate: participant.conference.endDate,
            location: participant.conference.location,
            receiptUrl: checkout.receiptURL,
            ticketUrl:
              process.env.APP_URL +
              '/conferences/participant-gateway?tab=ticket&participant=' +
              participant.id,
          });
          sendEmail({
            to: participant.email,
            subject: `Paiement confirmé - ${participant.conference.title}`,
            html: htmlContent,
          });
        } else if (checkout.status === 'cancelled') {
          await this.prisma.participant.update({
            where: { id: participant.id },
            data: {
              subscriptionStatus: SubscriptionStatus.CANCELLED,
              subscriptionStatusHistory: {
                create: {
                  status: SubscriptionStatus.CANCELLED,
                  rejectionReason: 'Paiement annulé',
                },
              },
            },
          });
        }
      });
    } catch (error) {
      console.log('syncPaydunyatokenStatus error', error);
    }
  }

  async attachAccommodation(
    participantId: string,
    conferenceAccommodationID: string,
  ) {
    try {
      const data = await this.prisma.conferenceAccommodation.findFirst({
        where: { id: conferenceAccommodationID },
        include: { conference: true },
      });
      if (!data) {
        throw new NotFoundException(api_code.MSG_231);
      }

      return this.prisma.participant.update({
        where: { id: participantId, conferenceId: data.conferenceId },
        data: {
          conferenceAccommodationId: conferenceAccommodationID,
        },
      });
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_232);
    }
  }
}
