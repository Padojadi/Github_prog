import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { VisaValidationDecision, VisaWorkflowStatus } from '@prisma/client';
import { SearchDto } from 'src/core/dtos/search.dto';

export class CreateVisaRequestDto {
  @ApiProperty({ description: 'Nom du demandeur' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @ApiProperty({ description: 'Prenom du demandeur' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({
    description: 'Date de naissance',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;

  @ApiProperty({ description: 'Nationalite' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nationality: string;

  @ApiProperty({ description: 'Numero de passeport' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  passportNumber: string;

  @ApiProperty({ description: 'Type de visa demande' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  visaType: string;

  @ApiProperty({
    description: 'Liste des documents fournis (texte libre)',
  })
  @IsString()
  @IsNotEmpty()
  documents: string;
}

export class VisaRequestSearchDto extends SearchDto {
  @ApiPropertyOptional({
    description: 'Filtrer par statut de workflow',
    enum: VisaWorkflowStatus,
  })
  @IsOptional()
  @IsEnum(VisaWorkflowStatus)
  status?: VisaWorkflowStatus;

  @ApiPropertyOptional({
    description: 'Filtrer par decision de validation',
    enum: VisaValidationDecision,
  })
  @IsOptional()
  @IsEnum(VisaValidationDecision)
  decision?: VisaValidationDecision;

  @ApiPropertyOptional({
    description: 'Filtrer par numero de dossier',
  })
  @IsOptional()
  @IsString()
  dossierNumber?: string;

  @ApiPropertyOptional({
    description: 'Filtrer par numero de visa',
  })
  @IsOptional()
  @IsString()
  visaNumber?: string;
}

export class VisaWorkflowStatusFilterDto {
  @ApiPropertyOptional({
    description: 'Filtrer par statut de workflow',
    enum: VisaWorkflowStatus,
  })
  @IsOptional()
  @IsEnum(VisaWorkflowStatus)
  status?: VisaWorkflowStatus;
}

export class VisaKpiFiltersDto {
  @ApiPropertyOptional({
    description: 'Date de début pour le calcul des KPI',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  from?: Date;

  @ApiPropertyOptional({
    description: 'Date de fin pour le calcul des KPI',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  to?: Date;
}

export class ValidateVisaRequestDto {
  @ApiProperty({
    description: 'Numero dossier',
  })
  @IsString()
  @IsNotEmpty()
  dossierNumber: string;

  @ApiPropertyOptional({
    description: 'Score automatique',
    example: 78,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  automaticScore?: number;

  @ApiProperty({
    description: 'Analyse DPI',
  })
  @IsString()
  @IsNotEmpty()
  dpiAnalysis: string;

  @ApiProperty({
    description: 'Decision de validation',
    enum: VisaValidationDecision,
  })
  @IsEnum(VisaValidationDecision)
  decision: VisaValidationDecision;

  @ApiPropertyOptional({
    description: 'Motif de rejet (obligatoire si decision REJECT)',
  })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

export class NotifyVisaRequestDto {
  @ApiProperty({
    description: 'Numero dossier',
  })
  @IsString()
  @IsNotEmpty()
  dossierNumber: string;

  @ApiPropertyOptional({
    description: 'Notes de notification',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class IssueVisaRequestDto {
  @ApiProperty({
    description: 'Numero dossier',
  })
  @IsString()
  @IsNotEmpty()
  dossierNumber: string;

  @ApiPropertyOptional({
    description: 'Numero visa (si vide, genere automatiquement)',
  })
  @IsOptional()
  @IsString()
  visaNumber?: string;

  @ApiPropertyOptional({
    description: "Date d'emission",
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  issuedAt?: Date;

  @ApiPropertyOptional({
    description: "Notes d'emission",
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class WithdrawVisaRequestDto {
  @ApiProperty({
    description: 'Numero visa emis',
  })
  @IsString()
  @IsNotEmpty()
  visaNumber: string;

  @ApiProperty({
    description: 'Nom du collecteur',
  })
  @IsString()
  @IsNotEmpty()
  collectorName: string;

  @ApiProperty({
    description: "Piece d'identite du collecteur",
  })
  @IsString()
  @IsNotEmpty()
  collectorIdentityDocument: string;

  @ApiProperty({
    description: 'Signature du collecteur',
  })
  @IsString()
  @IsNotEmpty()
  collectorSignature: string;

  @ApiProperty({
    description: 'Date du retrait',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  withdrawalDate: Date;
}
