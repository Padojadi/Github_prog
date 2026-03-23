import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Req,
  UseGuards,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ParticipantService } from './participant.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { SkipAuth } from 'src/core/decorators/skipauth.decorator';
import { UserPermission } from 'src/constants/enum';
import { Roles } from 'src/core/decorators/roles.decorator';
import { RejectSubscriptionDto } from './dto/update-participant.dto';
import { ParticipantTokenAuthGuard } from 'src/core/guards/x-participant-bearer.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from 'src/helpers/util';

@ApiTags('Participants')
@Controller('participants')
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}

  @Post('register-conference')
  @SkipAuth()
  @ApiOperation({ summary: 'Enregistrer un participant pour une conférence' })
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: imageFileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // Limite à 5 Mo
      },
    }),
  )
  async create(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() createParticipantDto: CreateParticipantDto,
  ) {
    const result = await this.participantService.createParticipant(
      avatar,
      createParticipantDto,
    );
    if (result.requiresValidation) {
      return result.participant;
    } else {
      return this.participantService.acceptSubscription(
        result.participant.id,
        null,
      );
    }
  }

  @Roles(UserPermission.MANAGE_CONFERENCES)
  @ApiOperation({ summary: "Accepter l'inscription d'un participant" })
  @Post(':id/accept-subscription')
  acceptSubscription(@Param('id') id: string, @Req() req) {
    return this.participantService.acceptSubscription(id, req.user);
  }

  @Roles(UserPermission.MANAGE_CONFERENCES)
  @ApiOperation({ summary: "Rejeter l'inscription d'un participant" })
  @Post(':id/reject-subscription')
  rejectConference(
    @Param('id') id: string,
    @Body() dto: RejectSubscriptionDto,
    @Req() req,
  ) {
    return this.participantService.rejectSubscription(id, dto, req.user);
  }

  @Get('/paiement-url')
  @ApiOperation({ summary: "Récupérer l'url de paiement" })
  @SkipAuth()
  @UseGuards(ParticipantTokenAuthGuard)
  async getPaymentUrl(@Req() req) {
    const participantId = req.participant.id;
    return this.participantService.getPaymentUrl(participantId);
  }

  @Get('/me')
  @ApiOperation({ summary: 'Récupérer le participant connecté' })
  @SkipAuth()
  @UseGuards(ParticipantTokenAuthGuard)
  async getMe(@Req() req) {
    const participantId = req.participant.id;
    return this.participantService.findOne(participantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un participant par son id' })
  async findOne(@Param('id') id: string) {
    return this.participantService.findOne(id);
  }

  @Patch(':conferenceAccommodationID/attach')
  @SkipAuth()
  @UseGuards(ParticipantTokenAuthGuard)
  attachAccommodation(
    @Param('conferenceAccommodationID') conferenceAccommodationID: string,
    @Req() req,
  ) {
    const participantId = req.participant.id;
    return this.participantService.attachAccommodation(
      participantId,
      conferenceAccommodationID,
    );
  }
}
