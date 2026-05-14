import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
  CreateConferenceDto,
  CreateConferenceRequestDto,
} from './create-conference.dto';
import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEnum, IsOptional } from 'class-validator';
import { SubscriptionStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { SearchDto } from 'src/core/dtos/search.dto';

export class UpdateConferenceDto extends PartialType(
  OmitType(CreateConferenceDto, ['id'] as const),
) {
  @ApiHideProperty()
  id: never;
}

export class UpdateConferenceRequestDto extends PartialType(
  CreateConferenceRequestDto,
) {}

export class GetConferenceParticipantsDto extends SearchDto {
  @IsOptional()
  @ApiPropertyOptional({
    description: "Statuts de l'inscription",
    isArray: true,
    enum: SubscriptionStatus,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(SubscriptionStatus, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value])) // Force un tableau
  status?: SubscriptionStatus[];

  @ApiPropertyOptional({
    description: 'Type de participant',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value])) // Force un tableau
  participantTypes?: string[];
}
