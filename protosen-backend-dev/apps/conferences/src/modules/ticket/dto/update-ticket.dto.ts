import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket.dto';
import { ApiHideProperty } from '@nestjs/swagger';

export class UpdateTicketDto extends PartialType(
  OmitType(CreateTicketDto, ['conferenceId'] as const),
) {
  @ApiHideProperty()
  conferenceId: never;
}
