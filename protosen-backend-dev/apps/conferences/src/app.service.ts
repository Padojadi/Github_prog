import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PaginationMeta } from './core/dtos/paginationmeta';
import { api_code } from './constants/api.codes';
import { Conference, ConferenceStatus, Prisma } from '@prisma/client';
import { GetConferencePublicDto } from './modules/conference/dto/create-conference.dto';
import { PrismaService } from './config/prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublic(params: GetConferencePublicDto) {
    try {
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
        lastStatus: ConferenceStatus.PUBLISHED,
      };

      if (params.startDate || params.endDate) {
        whereClause.createdAt = {};
        if (params.startDate) {
          whereClause.createdAt.gte = new Date(params.startDate);
        }
        if (params.endDate) {
          whereClause.createdAt.lte = new Date(params.endDate);
        }
      }

      const [conferences, totalCount] = await Promise.all([
        this.prisma.conference.findMany({
          where: whereClause,
          include: {
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
  findConference(id: string): Promise<Conference | null> {
    try {
      const whereClause: Prisma.ConferenceWhereInput = {
        id: id,
      };

      const result = this.prisma.conference.findFirst({
        where: whereClause,
        include: {
          tickets: true,
          conferenceAccommodations: {
            include: {
              accommodation: true,
            },
          },
        },
      });
      return result;
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_205);
    }
  }

  getParticipant(ticketcode: string) {
    try {
      return this.prisma.participant.findUnique({
        where: {
          code: ticketcode,
        },
        select: {
          id: true,
          lastName: true,
          firstName: true,
          phone: true,
          code: true,
          avatarUrl: true,
          country: true,
          customFunction: true,
          conference: true,
          ticket: true,
        },
      });
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_243);
    }
  }
}
