import { PartialType } from '@nestjs/swagger';
import {
  CreateLoungeBookingDto,
  CreateLoungeDto,
} from './create-lounge.dto';

export class UpdateLoungeDto extends PartialType(CreateLoungeDto) {}

export class UpdateLoungeBookingDto extends PartialType(CreateLoungeBookingDto) {}
