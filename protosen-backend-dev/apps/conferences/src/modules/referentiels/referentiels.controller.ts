import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ReferentielsService } from './referentiels.service';
import {
  CreateParticipantTypeDto,
  CreateFunctionDto,
  CreateSupportDto,
  UpdateParticipantTypeDto,
  UpdateFunctionDto,
  UpdateSupportDto,
} from './dto/create-referentiel.dto';
import { SearchDto } from 'src/core/dtos/search.dto';
import { UserPermission } from 'src/constants/enum';
import { Roles } from 'src/core/decorators/roles.decorator';
import { SkipAuth } from 'src/core/decorators/skipauth.decorator';

@ApiTags('Référentiels')
@Controller('referentiels')
export class ReferentielsController {
  constructor(private readonly service: ReferentielsService) {}

  // ---------- FunctionModel ----------

  @Roles(UserPermission.MANAGE_CONFERENCES)
  @Post('functions')
  @ApiOperation({ summary: 'Créer une fonction' })
  async createFunction(@Body() body: CreateFunctionDto) {
    return await this.service.createFunction(body);
  }

  @Get('functions')
  @SkipAuth()
  @ApiOperation({ summary: 'Lister les fonctions avec recherche' })
  async findAllFunctions(@Query() query: SearchDto) {
    return await this.service.findAllFunctions(query);
  }

  @Roles(UserPermission.MANAGE_CONFERENCES)
  @Patch('functions/:id')
  @ApiOperation({ summary: 'Mettre à jour une fonction' })
  async updateFunction(
    @Param('id') id: string,
    @Body() body: UpdateFunctionDto,
  ) {
    return await this.service.updateFunction(id, body);
  }

  @Roles(UserPermission.MANAGE_CONFERENCES)
  @Delete('functions/:id')
  @ApiOperation({ summary: 'Supprimer une fonction' })
  async deleteFunction(@Param('id') id: string) {
    return await this.service.deleteFunction(id);
  }

  // ---------- SupportOption ----------

  @Roles(UserPermission.MANAGE_CONFERENCES)
  @Post('supports')
  @ApiOperation({ summary: 'Créer une option de prise en charge' })
  async createSupport(@Body() body: CreateSupportDto) {
    return await this.service.createSupport(body);
  }

  @Get('supports')
  @SkipAuth()
  @ApiOperation({
    summary: 'Lister les options de prise en charge avec recherche',
  })
  async findAllSupports(@Query() query: SearchDto) {
    return await this.service.findAllSupports(query);
  }

  @Roles(UserPermission.MANAGE_CONFERENCES)
  @Patch('supports/:id')
  @ApiOperation({ summary: 'Mettre à jour une option de prise en charge' })
  async updateSupport(@Param('id') id: string, @Body() body: UpdateSupportDto) {
    return await this.service.updateSupport(id, body);
  }

  @Roles(UserPermission.MANAGE_CONFERENCES)
  @Delete('supports/:id')
  @ApiOperation({ summary: 'Supprimer une option de prise en charge' })
  async deleteSupport(@Param('id') id: string) {
    return await this.service.deleteSupport(id);
  }

  // ---------- ParticipantType ----------

  @Roles(UserPermission.MANAGE_CONFERENCES)
  @Post('participantType')
  @ApiOperation({ summary: 'Créer une catégorie de participant' })
  async createParticipanType(@Body() body: CreateParticipantTypeDto) {
    return await this.service.createParticipantType(body);
  }

  @Get('participantType')
  @SkipAuth()
  @ApiOperation({ summary: 'Lister les types de participants avec recherche' })
  async findAllParticipantType(@Query() query: SearchDto) {
    return await this.service.findAllParticipantType(query);
  }

  @Roles(UserPermission.MANAGE_CONFERENCES)
  @Patch('participantType/:id')
  @ApiOperation({ summary: 'Mettre à jour un type de participant' })
  async updateParticipantType(
    @Param('id') id: string,
    @Body() body: UpdateParticipantTypeDto,
  ) {
    return await this.service.updateParticipantType(id, body);
  }

  @Roles(UserPermission.MANAGE_CONFERENCES)
  @Delete('participantType/:id')
  @ApiOperation({ summary: 'Supprimer un type de participant' })
  async deleteParticipantType(@Param('id') id: string) {
    return await this.service.deleteParticipantType(id);
  }
}
