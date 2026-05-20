import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  AttachAccommodationConferenceDto,
  CreateAccommodationDto,
} from './dto/create-accommodation.dto';
import { UpdateAccommodationDto } from './dto/update-accommodation.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { api_code, isAPIError } from 'src/constants/api.codes';
import { ConferenceStatus } from '@prisma/client';

@Injectable()
export class AccommodationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAccommodationDto: CreateAccommodationDto) {
    try {
      return await this.prisma.accommodation.create({
        data: createAccommodationDto,
      });
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_216);
    }
  }

  async detachConference(params: {
    conferenceId: string;
    accommodationId: string;
  }) {
    try {
      return await this.prisma.conferenceAccommodation.deleteMany({
        where: {
          conferenceId: params.conferenceId,
          accommodationId: params.accommodationId,
        },
      });
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_217);
    }
  }

  async attachConference(createDto: AttachAccommodationConferenceDto) {
    try {
      const oldConference = await this.prisma.conference.findFirst({
        where: { id: createDto.conferenceId },
        include: {
          conferenceAccommodations: true,
        },
      });

      if (!oldConference) {
        throw new UnprocessableEntityException(api_code.MSG_205);
      }

      const latestStatus = oldConference.lastStatus;
      const isRequiredStatus =
        latestStatus === ConferenceStatus.CONFIRMED ||
        latestStatus === ConferenceStatus.PUBLISHED;

      if (!isRequiredStatus) {
        throw new UnprocessableEntityException(api_code.MSG_215);
      }

      const existingAccommodations = await this.prisma.accommodation.findMany({
        where: { id: { in: createDto.accommodationIds } },
        select: { id: true },
      });

      const validAccommodationIds = existingAccommodations.map((a) => a.id);

      if (validAccommodationIds.length !== createDto.accommodationIds.length) {
        throw new BadRequestException(api_code.MSG_233);
      }

      return await this.prisma.$transaction([
        this.prisma.conferenceAccommodation.deleteMany({
          where: { conferenceId: createDto.conferenceId },
        }),
        this.prisma.conferenceAccommodation.createMany({
          data: validAccommodationIds.map((accommodationId) => ({
            conferenceId: createDto.conferenceId,
            accommodationId,
          })),
        }),
      ]);
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

  async findAll() {
    try {
      return await this.prisma.accommodation.findMany();
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_217);
    }
  }

  async findOne(id: string) {
    try {
      const accommodation = await this.prisma.accommodation.findUnique({
        where: { id },
      });

      if (!accommodation) {
        throw new NotFoundException(api_code.MSG_218);
      }
      return accommodation;
    } catch (error) {
      if (error.response && isAPIError(error.response)) {
        throw error;
      } else throw new UnprocessableEntityException(api_code.MSG_218);
    }
  }

  async update(id: string, updateAccommodationDto: UpdateAccommodationDto) {
    try {
      const existing = await this.prisma.accommodation.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException(api_code.MSG_218);
      }

      return await this.prisma.accommodation.update({
        where: { id },
        data: updateAccommodationDto,
      });
    } catch (error) {
      if (error.response && isAPIError(error.response)) {
        throw error;
      } else throw new UnprocessableEntityException(api_code.MSG_219);
    }
  }

  async remove(id: string) {
    try {
      const existing = await this.prisma.accommodation.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException(api_code.MSG_218);
      }

      await this.prisma.accommodation.delete({ where: { id } });
      return { message: 'Accommodation deleted successfully' };
    } catch (error) {
      if (error.response && isAPIError(error.response)) {
        throw error;
      } else throw new UnprocessableEntityException(api_code.MSG_220);
    }
  }
}
