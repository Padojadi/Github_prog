import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import {
  CreateParticipantTypeDto,
  CreateFunctionDto,
  CreateSupportDto,
  UpdateParticipantTypeDto,
  UpdateFunctionDto,
  UpdateSupportDto,
} from './dto/create-referentiel.dto';
import { SearchDto } from 'src/core/dtos/search.dto';
import { api_code } from 'src/constants/api.codes';
import { Prisma } from '@prisma/client';
import { PaginationMeta } from 'src/core/dtos/paginationmeta';

@Injectable()
export class ReferentielsService {
  constructor(private readonly prisma: PrismaService) {}

  // ------------------ FUNCTION MODEL ------------------

  async createFunction(data: CreateFunctionDto) {
    try {
      return this.prisma.functionModel.create({ data });
    } catch {
      throw new InternalServerErrorException(api_code.MSG_244);
    }
  }

  async findAllFunctions(params: SearchDto) {
    try {
      const { search, page, limit } = params;
      const whereCondition: Prisma.FunctionModelWhereInput = search
        ? { name: { contains: search, mode: 'insensitive' } }
        : undefined;

      const [totalCount, result] = await Promise.all([
        this.prisma.functionModel.count({
          where: whereCondition,
        }),
        this.prisma.functionModel.findMany({
          where: whereCondition,
          ...(limit ? { skip: (page - 1) * limit } : {}),
          ...(limit ? { take: limit } : {}),
          orderBy: { name: 'asc' },
        }),
      ]);
      const paginationMeta = new PaginationMeta(
        params.page || 1,
        params.limit || result.length,
        totalCount,
      );
      return {
        data: result,
        meta: paginationMeta,
      };
    } catch {
      throw new InternalServerErrorException(api_code.MSG_245);
    }
  }

  async updateFunction(id: string, data: UpdateFunctionDto) {
    try {
      const functionModel = await this.prisma.functionModel.findUnique({
        where: { id },
      });
      if (!functionModel) {
        throw new NotFoundException(api_code.MSG_247);
      }
      return this.prisma.functionModel.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(api_code.MSG_246);
    }
  }

  async deleteFunction(id: string) {
    try {
      const functionModel = await this.prisma.functionModel.findUnique({
        where: { id },
      });
      if (!functionModel) {
        throw new NotFoundException(api_code.MSG_247);
      }
      return this.prisma.functionModel.delete({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(api_code.MSG_248);
    }
  }

  // ------------------ SUPPORT OPTION ------------------

  async createSupport(data: CreateSupportDto) {
    try {
      return this.prisma.supportOption.create({ data });
    } catch {
      throw new NotFoundException(api_code.MSG_249);
    }
  }

  async findAllSupports(params: SearchDto) {
    try {
      const { search, page, limit } = params;

      const whereCondition: Prisma.SupportOptionWhereInput = search
        ? { label: { contains: search, mode: 'insensitive' } }
        : undefined;
      const [totalCount, result] = await Promise.all([
        this.prisma.supportOption.count({
          where: whereCondition,
        }),
        this.prisma.supportOption.findMany({
          where: whereCondition,
          ...(limit ? { skip: (page - 1) * limit } : {}),
          ...(limit ? { take: limit } : {}),
          orderBy: { label: 'asc' },
        }),
      ]);
      const paginationMeta = new PaginationMeta(
        params.page || 1,
        params.limit || result.length,
        totalCount,
      );
      return {
        data: result,
        meta: paginationMeta,
      };
    } catch {
      throw new NotFoundException(api_code.MSG_250);
    }
  }

  async updateSupport(id: string, data: UpdateSupportDto) {
    try {
      const supportOption = await this.prisma.supportOption.findUnique({
        where: { id },
      });
      if (!supportOption) {
        throw new NotFoundException(api_code.MSG_252);
      }
      return this.prisma.supportOption.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(api_code.MSG_251);
    }
  }

  async deleteSupport(id: string) {
    try {
      const supportOption = await this.prisma.supportOption.findUnique({
        where: { id },
      });
      if (!supportOption) {
        throw new NotFoundException(api_code.MSG_252);
      }
      return this.prisma.supportOption.delete({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(api_code.MSG_253);
    }
  }

  // ------------------ PARTICIPANT TYPE ------------------

  async createParticipantType(data: CreateParticipantTypeDto) {
    try {
      return this.prisma.participantType.create({ data });
    } catch {
      throw new InternalServerErrorException(api_code.MSG_254);
    }
  }

  async findAllParticipantType(params: SearchDto) {
    try {
      const { search, page, limit } = params;

      const whereCondition: Prisma.ParticipantTypeWhereInput = search
        ? { label: { contains: search, mode: 'insensitive' } }
        : undefined;
      const [totalCount, result] = await Promise.all([
        this.prisma.participantType.count({
          where: whereCondition,
        }),
        this.prisma.participantType.findMany({
          where: whereCondition,
          ...(limit ? { skip: (page - 1) * limit } : {}),
          ...(limit ? { take: limit } : {}),
          orderBy: { label: 'asc' },
        }),
      ]);
      const paginationMeta = new PaginationMeta(
        params.page || 1,
        params.limit || result.length,
        totalCount,
      );
      return {
        data: result,
        meta: paginationMeta,
      };
    } catch {
      throw new InternalServerErrorException(api_code.MSG_255);
    }
  }

  async updateParticipantType(id: string, data: UpdateParticipantTypeDto) {
    try {
      const category = await this.prisma.participantType.findUnique({
        where: { id },
      });
      if (!category) {
        throw new NotFoundException(api_code.MSG_256);
      }
      return this.prisma.participantType.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(api_code.MSG_257);
    }
  }

  async deleteParticipantType(id: string) {
    try {
      const category = await this.prisma.participantType.findUnique({
        where: { id },
      });
      if (!category) {
        throw new NotFoundException(api_code.MSG_256);
      }
      return this.prisma.participantType.delete({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(api_code.MSG_258);
    }
  }
}
