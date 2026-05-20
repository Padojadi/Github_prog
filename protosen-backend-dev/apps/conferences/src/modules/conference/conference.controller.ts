import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ConferenceService } from './conference.service';
import {
  GetConferenceParticipantsDto,
  UpdateConferenceDto,
  UpdateConferenceRequestDto,
} from './dto/update-conference.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AssignParticipantTypesDto,
  CreateConferenceDto,
  CreateConferenceRequestDto,
  GetConferenceRequestDto,
} from './dto/create-conference.dto';
import { Roles } from 'src/core/decorators/roles.decorator';
import { UserPermission } from 'src/constants/enum';
import { SearchDto } from 'src/core/dtos/search.dto';
import { SkipAuth } from 'src/core/decorators/skipauth.decorator';

@ApiTags('conference')
@Controller('conference')
export class ConferenceController {
  constructor(private readonly conferenceService: ConferenceService) {}

  @Roles(
    UserPermission.MANAGE_CONFERENCES,
    UserPermission.ACCESS_CONFERENCE_MODULE,
  )
  @Post('publish')
  async publish(@Req() req, @Body() createConferenceDto: CreateConferenceDto) {
    await this.conferenceService.publish(createConferenceDto, req.user);
    return { message: 'Conference published successfully' };
  }

  @Roles(
    UserPermission.REQUEST_CONFERENCE,
    UserPermission.ACCESS_CONFERENCE_MODULE,
  )
  @Post('request')
  async createRequest(
    @Req() req,
    @Body() createConferenceDto: CreateConferenceRequestDto,
  ) {
    return this.conferenceService.createRequest(createConferenceDto, req.user);
  }

  @Get()
  @Roles(UserPermission.ACCESS_CONFERENCE_MODULE)
  findAll(
    @Req() req,
    @Query(new ValidationPipe({ transform: true, skipMissingProperties: true }))
    params: GetConferenceRequestDto,
  ) {
    return this.conferenceService.findAll(req.user, params);
  }

  @Roles(
    UserPermission.MANAGE_CONFERENCES,
    UserPermission.ACCESS_CONFERENCE_MODULE,
  )
  @Get(':id/accommodations')
  findAccommodations(@Param('id') conferenceId: string) {
    return this.conferenceService.findAccommodations(conferenceId);
  }

  @Get('creator/:id')
  @Roles(UserPermission.ACCESS_CONFERENCE_MODULE)
  findForCreator(
    @Param('id') id: string,
    @Req() req,
    @Query(new ValidationPipe({ transform: true, skipMissingProperties: true }))
    params: GetConferenceRequestDto,
  ) {
    return this.conferenceService.findByCreator(id, req.user, params);
  }

  @Patch('request/:id')
  @Roles(UserPermission.ACCESS_CONFERENCE_MODULE)
  updateRequest(
    @Param('id') id: string,
    @Body() updateConferenceDto: UpdateConferenceRequestDto,
    @Req() req,
  ) {
    return this.conferenceService.updateRequest(
      id,
      updateConferenceDto,
      req.user,
    );
  }

  @Roles(
    UserPermission.MANAGE_CONFERENCES,
    UserPermission.ACCESS_CONFERENCE_MODULE,
  )
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateConferenceDto) {
    return this.conferenceService.update(id, dto);
  }

  @Get(':id')
  @Roles(UserPermission.ACCESS_CONFERENCE_MODULE)
  findOne(@Param('id') id: string, @Req() req) {
    return this.conferenceService.findOne(id, req.user);
  }

  @Delete(':id')
  @Roles(UserPermission.ACCESS_CONFERENCE_MODULE)
  remove(@Param('id') id: string, @Req() req) {
    return this.conferenceService.remove(id, req.user.id);
  }

  @Roles(
    UserPermission.MANAGE_CONFERENCES,
    UserPermission.ACCESS_CONFERENCE_MODULE,
  )
  @Get(':id/participants')
  findParticipants(
    @Param('id') id: string,
    @Query() query: GetConferenceParticipantsDto,
  ) {
    return this.conferenceService.findParticipants(id, query);
  }

  @Roles(
    UserPermission.MANAGE_CONFERENCES,
    UserPermission.ACCESS_CONFERENCE_MODULE,
  )
  @Post('assign-participant-types')
  @ApiOperation({ summary: 'Affecter des participant types à une conférence' })
  assignParticipantTypes(@Body() dto: AssignParticipantTypesDto) {
    return this.conferenceService.assignParticipantTypes(dto);
  }

  @Get('participant-types/:conferenceID')
  @ApiOperation({
    summary:
      "Lister les participant types d'une conférence avec pagination et recherche",
  })
  @SkipAuth()
  getAssignedParticipantTypes(
    @Query() dto: SearchDto,
    @Param('conferenceID') conferenceID: string,
  ) {
    return this.conferenceService.getAssignedParticipantTypes(
      conferenceID,
      dto,
    );
  }
}
