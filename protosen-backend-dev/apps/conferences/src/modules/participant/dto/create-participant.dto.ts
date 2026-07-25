import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsUUID,
  IsDate,
  IsEnum,
  IsBooleanString,
  IsArray,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Gender } from '@prisma/client';

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsTrue(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isTrue',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value === true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} doit être true`;
        },
      },
    });
  };
}

export class CreateParticipantDto {
  @ApiProperty({ description: 'Prénom du participant' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Nom de famille du participant' })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Genre du participant',
    example: 'Male',
    enum: Gender,
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ description: 'Organisation du participant' })
  @IsString()
  organisation: string;

  @ApiProperty({
    description: 'Photo du participant (fichier)',
    type: 'string',
    format: 'binary',
  })
  avatar: any;

  @ApiProperty({ description: 'Code postal' })
  @IsString()
  postalCode: string;

  @ApiProperty({ description: 'Ville' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'Pays' })
  @IsString()
  country: string;

  @ApiProperty({ description: 'Besoin de visa (Oui/Non)' })
  @IsBooleanString()
  visaNeeded: string;

  @ApiProperty({ description: 'Acceptation des conditions générales' })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsTrue({ message: 'Les conditions générales doivent être acceptées.' })
  acceptTerms: boolean;

  @ApiProperty({ description: 'Adresse e-mail' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Adresse' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Numéro de téléphone' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'ID du ticket associé' })
  @IsUUID()
  ticketId: string;

  @ApiProperty({ description: 'ID de la conférence associée' })
  @IsUUID()
  conferenceId: string;

  @ApiProperty({ description: "Type de pièce d'identité" })
  @IsString()
  identityType: string;

  @ApiProperty({ description: "Numéro d'identité" })
  @IsString()
  identityNumber: string;

  @ApiProperty({ description: "Date de délivrance de la pièce d'identité" })
  @IsDate()
  @Type(() => Date)
  identityIssueDate: Date;

  @ApiProperty({ description: 'Date de naissance' })
  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @ApiProperty({ description: 'Nationalité' })
  @IsString()
  nationality: string;

  @ApiPropertyOptional({
    description: "ID de l'hébergement conférence (optionnel)",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  conferenceAccommodationId?: string;

  @ApiPropertyOptional({
    description: 'Hébergement personnalisé (optionnel)',
    required: false,
  })
  @IsString()
  @IsOptional()
  customAccommodation?: string;

  @ApiPropertyOptional({
    description: 'fonction personnalisée (optionnel)',
    required: false,
  })
  @IsString()
  @IsOptional()
  customFunction: string;

  @ApiPropertyOptional({
    description: 'ID de la fonction (optionnel)',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  functionId: string;

  @ApiPropertyOptional({
    description: 'IDs des options de support (optionnel)',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : value ? [value] : []))
  supportOptionIds: string[];

  @ApiPropertyOptional({
    description: 'ID du type de participant à la conférence',
    required: true,
  })
  @IsUUID()
  conferenceParticipantTypeId: string;
}
