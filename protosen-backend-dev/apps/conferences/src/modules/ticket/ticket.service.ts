import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ConferenceStatus } from '@prisma/client';
import { api_code, isAPIError } from 'src/constants/api.codes';

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTicketDto: CreateTicketDto) {
    try {
      const conference = await this.prisma.conference.findFirst({
        where: { id: createTicketDto.conferenceId },
        include: {
          statusHistories: {
            orderBy: { changedAt: 'desc' },
            take: 1,
          },
        },
      });

      if (!conference) {
        throw new UnprocessableEntityException(api_code.MSG_205);
      }

      const latestStatus = conference.statusHistories[0].status;
      const isRequiredStatus =
        latestStatus === ConferenceStatus.CONFIRMED ||
        latestStatus === ConferenceStatus.PUBLISHED;

      if (!isRequiredStatus) {
        throw new UnprocessableEntityException(api_code.MSG_215);
      }

      return await this.prisma.ticket.create({ data: createTicketDto });
    } catch (error) {
      if (error.response && isAPIError(error.response)) {
        throw error;
      } else throw new UnprocessableEntityException(api_code.MSG_222);
    }
  }

  async findAll(conferenceId: string) {
    try {
      return await this.prisma.ticket.findMany({
        where: { conferenceId },
      });
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_223);
    }
  }

  async findOne(id: string) {
    try {
      return await this.prisma.ticket.findUnique({ where: { id } });
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_224);
    }
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {
    try {
      const ticket = await this.prisma.ticket.findUnique({
        where: { id },
        include: {
          subscriptions: true,
        },
      });
      if (!ticket) throw new NotFoundException(api_code.MSG_224);

      if (ticket.subscriptions.length > 0)
        throw new UnprocessableEntityException(api_code.MSG_227);

      return await this.prisma.ticket.update({
        where: { id },
        data: updateTicketDto,
      });
    } catch (error) {
      if (error.response && isAPIError(error.response)) {
        throw error;
      } else throw new UnprocessableEntityException(api_code.MSG_225);
    }
  }

  async remove(id: string) {
    try {
      const ticket = await this.prisma.ticket.findUnique({
        where: { id },
        include: {
          subscriptions: true,
        },
      });
      if (!ticket) throw new NotFoundException(api_code.MSG_224);

      if (ticket.subscriptions.length > 0)
        throw new UnprocessableEntityException(api_code.MSG_227);

      return await this.prisma.ticket.delete({ where: { id } });
    } catch (error) {
      if (error.response && isAPIError(error.response)) {
        throw error;
      } else throw new UnprocessableEntityException(api_code.MSG_226);
    }
  }
}
