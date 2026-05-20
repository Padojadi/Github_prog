import {
  IsString,
  IsEmail,
  IsOptional,
  IsDate,
  IsUrl,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
  IsUUID,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ConferenceStatus } from '@prisma/client';
import { SearchDto } from 'src/core/dtos/search.dto';

export class CreateConferenceRequestDto {
  @ApiProperty({
    description: 'Prénom de la personne organisant la conférence',
  })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Nom de la personne organisant la conférence' })
  @IsString()
  lastName: string;

  // @ApiProperty({ description: "Identifiant de l'institution organisatrice" })
  // @IsString()
  // institutionId: string;

  @ApiProperty({ description: "Poste de la personne organisant l'événement" })
  @IsString()
  job: string;

  @ApiProperty({
    description: 'Adresse email de la personne organisant la conférence',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Document sur le thème de la conférence',
  })
  @IsUrl()
  themeDoc: string;

  @ApiProperty({ description: 'Document de budget de la conférence' })
  @IsUrl()
  budgetDoc: string;

  @ApiProperty({
    description: 'Date de début de la conférence',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    description: 'Date de fin de la conférence',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({
    description: 'Numéro matricule de la personne organisant la conférence',
  })
  @IsString()
  matriculeNumber: string;

  @ApiProperty({
    description: 'Numéro de téléphone de la personne organisant la conférence',
  })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Titre de la conférence' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Lieu de la conférence' })
  @IsString()
  location: string;

  @ApiProperty({ description: "Raison de l'organisation de la conférence" })
  @IsString()
  description: string;
}

export class GetConferenceRequestDto extends SearchDto {
  @IsOptional()
  @ApiPropertyOptional({
    description: "Identifiant de l'institution organisatrice",
  })
  @IsString()
  institutionId: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Date de début de la conférence',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Date de fin de la conférence',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Statuts de la conférence',
    isArray: true,
    enum: ConferenceStatus,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(ConferenceStatus, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value])) // Force un tableau
  status?: ConferenceStatus[];
}

export class GetConferencePublicDto extends SearchDto {
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Date de début de la conférence',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Date de fin de la conférence',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  endDate: Date;
}

export class CreateConferenceDto {
  @ApiProperty({
    description: 'Identifiant de la demande de conférence',
  })
  @IsString()
  id: string;

  @ApiPropertyOptional({
    description: "Raison de l'organisation de la conférence",
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'Liste des identifiants des hébergements',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, {
    message: "Il doit y avoir au moins un identifiant d'hébergement",
  })
  accommodationIds: string[];
}

export class ParticipantTypeAssignmentDto {
  @ApiProperty({ example: 'uuid-du-participantType' })
  @IsUUID()
  participantTypeId: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  requiresValidation: boolean;
}

export class AssignParticipantTypesDto {
  @ApiProperty({ example: 'uuid-de-la-conference' })
  @IsUUID()
  conferenceId: string;

  @ApiProperty({
    type: [ParticipantTypeAssignmentDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParticipantTypeAssignmentDto)
  participantTypes: ParticipantTypeAssignmentDto[];
}
