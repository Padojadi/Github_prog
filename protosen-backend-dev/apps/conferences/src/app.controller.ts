import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { api_code_to_json } from './constants/api.codes';
import { SkipAuth } from './core/decorators/skipauth.decorator';
import { GetConferencePublicDto } from './modules/conference/dto/create-conference.dto';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('api-codes')
  getApiCodes() {
    return api_code_to_json;
  }

  @Get('public/conferences')
  @SkipAuth()
  findConferences(
    @Req() req,
    @Query(new ValidationPipe({ transform: true, skipMissingProperties: true }))
    params: GetConferencePublicDto,
  ) {
    return this.appService.findPublic(params);
  }

  @Get('public/conferences/:id')
  @SkipAuth()
  findOne(@Param('id') id: string) {
    return this.appService.findConference(id);
  }

  @ApiExcludeEndpoint()
  @Get('paydunya-callback')
  @SkipAuth()
  paydunyaCallback(@Req() req) {
    console.log(req.query);
    return { message: 'Callback received' };
  }

  @Get('public/participant/:ticketcode')
  @SkipAuth()
  getParticipant(@Param('ticketcode') ticketcode: string) {
    return this.appService.getParticipant(ticketcode);
  }
}
