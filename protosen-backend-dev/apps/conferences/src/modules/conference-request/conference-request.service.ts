import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import {
  RejectConferenceDto,
  RejectPermanentlyConferenceDto,
} from './dto/create-conference-request.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ConferenceStatus } from '@prisma/client';
import { api_code } from 'src/constants/api.codes';
import { User } from '../user/generated/user';
import { lastValueFrom } from 'rxjs';
import { UserService } from '../user/user.service';
import { generateRejectionEmailHtml } from 'src/helpers/emailHelper';
import sendEmail from 'src/config/mail.config';

@Injectable()
export class ConferenceRequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async acceptConference(conferenceId: string, user: User) {
    try {
      const conference = await this.prisma.conference.findUnique({
        where: { id: conferenceId },
        include: {
          statusHistories: {
            orderBy: {
              changedAt: 'desc',
            },
            take: 1, // Ne récupérer que le dernier statut
          },
        },
      });
      if (!conference || conference.statusHistories.length === 0) {
        throw new UnprocessableEntityException(api_code.MSG_205);
      }

      const latestStatus = conference.statusHistories[0].status;
      const isForbiddenStatus =
        latestStatus === ConferenceStatus.ACCEPTED ||
        latestStatus === ConferenceStatus.VALIDATED ||
        latestStatus === ConferenceStatus.CONFIRMED ||
        latestStatus === ConferenceStatus.PUBLISHED ||
        latestStatus === ConferenceStatus.REJECTED_PERMANENTLY;

      if (isForbiddenStatus) {
        throw new UnprocessableEntityException(api_code.MSG_215);
      }

      return this.prisma.conference.update({
        where: { id: conferenceId },
        data: {
          lastStatus: ConferenceStatus.ACCEPTED,
          statusHistories: {
            create: {
              status: ConferenceStatus.ACCEPTED,
              changedByID: user.id,
            },
          },
        },
      });
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_212);
    }
  }

  async validateConference(conferenceId: string, user: User) {
    try {
      const conference = await this.prisma.conference.findUnique({
        where: { id: conferenceId },
      });
      if (!conference) {
        throw new UnprocessableEntityException(api_code.MSG_205);
      }

      const isForbiddenStatus =
        conference.lastStatus === ConferenceStatus.VALIDATED ||
        conference.lastStatus === ConferenceStatus.CONFIRMED ||
        conference.lastStatus === ConferenceStatus.PUBLISHED;

      if (isForbiddenStatus) {
        throw new UnprocessableEntityException(api_code.MSG_215);
      }

      return this.prisma.conference.update({
        where: { id: conferenceId },
        data: {
          lastStatus: ConferenceStatus.VALIDATED,
          statusHistories: {
            create: {
              status: ConferenceStatus.VALIDATED,
              changedByID: user.id,
            },
          },
        },
      });
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_212);
    }
  }

  async confirmConference(conferenceId: string, user: User) {
    try {
      const conference = await this.prisma.conference.findUnique({
        where: { id: conferenceId },
      });
      if (!conference) {
        throw new UnprocessableEntityException(api_code.MSG_205);
      }

      const isForbiddenStatus =
        conference.lastStatus === ConferenceStatus.CONFIRMED ||
        conference.lastStatus === ConferenceStatus.PUBLISHED;

      if (isForbiddenStatus) {
        throw new UnprocessableEntityException(api_code.MSG_215);
      }

      return this.prisma.conference.update({
        where: { id: conferenceId },
        data: {
          lastStatus: ConferenceStatus.CONFIRMED,
          statusHistories: {
            create: {
              status: ConferenceStatus.CONFIRMED,
              changedByID: user.id,
            },
          },
        },
      });
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_212);
    }
  }

  async rejectConference(
    conferenceId: string,
    dto: RejectConferenceDto,
    user: User,
  ) {
    try {
      const conference = await this.prisma.conference.findUnique({
        where: { id: conferenceId },
      });
      if (!conference) {
        throw new UnprocessableEntityException(api_code.MSG_205);
      }

      const isForbiddenStatus =
        conference.lastStatus === ConferenceStatus.CONFIRMED ||
        conference.lastStatus === ConferenceStatus.PUBLISHED;

      if (isForbiddenStatus) {
        throw new UnprocessableEntityException(api_code.MSG_215);
      }
      const response = this.prisma.conference.update({
        where: { id: conferenceId },
        data: {
          lastStatus: ConferenceStatus.REJECTED,
          statusHistories: {
            create: {
              status: ConferenceStatus.REJECTED,
              changedByID: user.id,
              rejectionReason: dto.rejectionReason,
            },
          },
        },
      });

      const htmlContent = generateRejectionEmailHtml(
        conference,
        dto.rejectionReason,
      );

      sendEmail({
        to: conference.email,
        subject: 'Conference rejetée',
        html: htmlContent,
      });
      return response;
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_213);
    }
  }

  async rejectPermanently(
    conferenceId: string,
    dto: RejectPermanentlyConferenceDto,
    user: User,
  ) {
    try {
      const conference = await this.prisma.conference.findUnique({
        where: { id: conferenceId },
      });
      if (!conference) {
        throw new UnprocessableEntityException(api_code.MSG_205);
      }

      const isForbiddenStatus =
        conference.lastStatus === ConferenceStatus.CONFIRMED ||
        conference.lastStatus === ConferenceStatus.PUBLISHED;

      if (isForbiddenStatus) {
        throw new UnprocessableEntityException(api_code.MSG_215);
      }
      const response = this.prisma.conference.update({
        where: { id: conferenceId },
        data: {
          lastStatus: ConferenceStatus.REJECTED_PERMANENTLY,
          statusHistories: {
            create: {
              status: ConferenceStatus.REJECTED_PERMANENTLY,
              changedByID: user.id,
              rejectionReason: dto.rejectionReason,
            },
          },
        },
      });

      const htmlContent = generateRejectionEmailHtml(
        conference,
        dto.rejectionReason,
      );

      sendEmail({
        to: conference.email,
        subject: 'Conference rejetée définitivement',
        html: htmlContent,
      });

      return response;
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_214);
    }
  }

  async getHistoryByConference(conferenceId: string) {
    try {
      const histories = await this.prisma.statusHistory.findMany({
        where: { conferenceId },
        orderBy: { changedAt: 'desc' },
      });

      const ids = [...new Set(histories.map((history) => history.changedByID))];
      const response = await lastValueFrom(this.userService.getUsersByIds(ids));

      return histories.map((history) => {
        const user = response.users.find((u) => u.id === history.changedByID);
        return {
          ...history,
          changedBy: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        };
      });
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_205);
    }
  }
}
