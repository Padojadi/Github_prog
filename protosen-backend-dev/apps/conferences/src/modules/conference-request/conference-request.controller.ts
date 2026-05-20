import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { ConferenceRequestService } from './conference-request.service';
import {
  RejectConferenceDto,
  RejectPermanentlyConferenceDto,
} from './dto/create-conference-request.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserPermission } from 'src/constants/enum';
import { Roles } from 'src/core/decorators/roles.decorator';

@ApiTags('Status History')
@Roles(UserPermission.ACCESS_CONFERENCE_MODULE)
@Controller('conference-request')
export class ConferenceRequestController {
  constructor(
    private readonly conferenceRequestService: ConferenceRequestService,
  ) {}

  @Roles(UserPermission.ACCEPT_CONFERENCE_REQUEST)
  @ApiOperation({ summary: 'Accepter une conférence' })
  @ApiResponse({ status: 201, description: 'Statut accepté avec succès' })
  @Post(':conferenceId/accept')
  acceptConference(@Param('conferenceId') conferenceId: string, @Req() req) {
    return this.conferenceRequestService.acceptConference(
      conferenceId,
      req.user,
    );
  }

  @Roles(UserPermission.VALIDATE_CONFERENCE_REQUEST)
  @ApiOperation({ summary: 'Valider une conférence' })
  @ApiResponse({ status: 201, description: 'Statut validé avec succès' })
  @Post(':conferenceId/validate')
  validateConference(@Param('conferenceId') conferenceId: string, @Req() req) {
    return this.conferenceRequestService.validateConference(
      conferenceId,
      req.user,
    );
  }

  @Roles(UserPermission.CONFIRM_CONFERENCE_REQUEST)
  @ApiOperation({ summary: 'Confirmer une conférence' })
  @ApiResponse({ status: 201, description: 'Statut confirmé avec succès' })
  @Post(':conferenceId/confirm')
  confirmConference(@Param('conferenceId') conferenceId: string, @Req() req) {
    return this.conferenceRequestService.confirmConference(
      conferenceId,
      req.user,
    );
  }

  @Roles(
    UserPermission.ACCEPT_CONFERENCE_REQUEST,
    UserPermission.VALIDATE_CONFERENCE_REQUEST,
    UserPermission.CONFIRM_CONFERENCE_REQUEST,
  )
  @ApiOperation({ summary: 'Rejeter une conférence' })
  @ApiResponse({ status: 201, description: 'Statut rejeté avec succès' })
  @Post(':conferenceId/reject')
  rejectConference(
    @Param('conferenceId') conferenceId: string,
    @Body() dto: RejectConferenceDto,
    @Req() req,
  ) {
    return this.conferenceRequestService.rejectConference(
      conferenceId,
      dto,
      req.user,
    );
  }

  @Roles(
    UserPermission.ACCEPT_CONFERENCE_REQUEST,
    UserPermission.VALIDATE_CONFERENCE_REQUEST,
    UserPermission.CONFIRM_CONFERENCE_REQUEST,
  )
  @ApiOperation({ summary: 'Rejeter définitivement une conférence' })
  @ApiResponse({
    status: 201,
    description: 'Statut rejeté définitivement avec succès',
  })
  @Post(':conferenceId/reject-permanently')
  rejectPermanently(
    @Param('conferenceId') conferenceId: string,
    @Body() dto: RejectPermanentlyConferenceDto,
    @Req() req,
  ) {
    return this.conferenceRequestService.rejectPermanently(
      conferenceId,
      dto,
      req.user,
    );
  }

  @Roles(
    UserPermission.ACCEPT_CONFERENCE_REQUEST,
    UserPermission.VALIDATE_CONFERENCE_REQUEST,
    UserPermission.CONFIRM_CONFERENCE_REQUEST,
    UserPermission.MANAGE_CONFERENCES,
  )
  @ApiOperation({
    summary: "Récupérer l'historique des statuts d'une conférence",
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des statuts de la conférence',
  })
  @Get('statusHistory/:conferenceId')
  getHistoryByConference(@Param('conferenceId') conferenceId: string) {
    return this.conferenceRequestService.getHistoryByConference(conferenceId);
  }
}
