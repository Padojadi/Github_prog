import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  LoungeBookingStatus,
  LoungePaymentMethod,
  LoungePaymentStatus,
  LoungeStatus,
} from '@prisma/client';
import { SearchDto } from 'src/core/dtos/search.dto';

export class TimeSlotDto {
  @ApiProperty({ description: 'Heure de début (HH:mm)', example: '09:00' })
  @IsString()
  @MaxLength(5)
  start: string;

  @ApiProperty({ description: 'Heure de fin (HH:mm)', example: '17:00' })
  @IsString()
  @MaxLength(5)
  end: string;
}

export class CreateLoungeDto {
  @ApiProperty({ description: 'Nom du salon', example: 'Salon Présidentiel' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Description du salon' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Capacité maximale du salon', example: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiPropertyOptional({
    description: 'Liste des services disponibles',
    type: [String],
    example: ['WiFi', 'Restauration', 'Écran'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @ApiProperty({
    description: 'Tarif horaire',
    example: 12000,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  hourlyRate: number;

  @ApiPropertyOptional({
    description: "URL de l'image du salon",
    example: 'https://example.com/lounge.jpg',
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({ enum: LoungeStatus, default: LoungeStatus.ACTIVE })
  @IsOptional()
  @IsEnum(LoungeStatus)
  status?: LoungeStatus;

  @ApiProperty({
    description: 'Emplacement du salon',
    example: 'Aéroport Blaise Diagne - Zone VIP',
  })
  @IsString()
  location: string;

  @ApiPropertyOptional({
    description: 'Type de salon',
    example: 'Executive',
  })
  @IsOptional()
  @IsString()
  loungeType?: string;

  @ApiPropertyOptional({
    description: 'Nombre maximum de réservations autorisées par jour',
    example: 12,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxBookings?: number;

  @ApiPropertyOptional({
    description: 'Jours de disponibilité',
    type: [String],
    example: ['Lundi', 'Mardi', 'Mercredi'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  availableDays?: string[];

  @ApiPropertyOptional({
    description: 'Créneaux horaires disponibles',
    type: [TimeSlotDto],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  timeSlots?: TimeSlotDto[];
}

export class LoungeSearchDto extends SearchDto {
  @ApiPropertyOptional({
    description: 'Filtrer les salons par statut',
    enum: LoungeStatus,
  })
  @IsOptional()
  @IsEnum(LoungeStatus)
  status?: LoungeStatus;
}

export class CreateLoungeBookingDto {
  @ApiProperty({
    description: 'Identifiant du salon',
  })
  @IsString()
  loungeId: string;

  @ApiPropertyOptional({
    description: "Identifiant de l'utilisateur (admin uniquement)",
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    description: 'Date/heure de début de réservation',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  startTime: Date;

  @ApiProperty({
    description: 'Date/heure de fin de réservation',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  endTime: Date;

  @ApiProperty({
    description: "Nombre d'invités",
    example: 3,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  numGuests: number;

  @ApiPropertyOptional({
    description: 'Montant total (laissé vide pour calcul automatique)',
    example: 45000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalAmount?: number;

  @ApiPropertyOptional({ description: 'Demandes spécifiques' })
  @IsOptional()
  @IsString()
  specialRequests?: string;

  @ApiPropertyOptional({
    description: 'Mode de paiement',
    enum: LoungePaymentMethod,
    default: LoungePaymentMethod.ON_SITE,
  })
  @IsOptional()
  @IsEnum(LoungePaymentMethod)
  paymentMethod?: LoungePaymentMethod;

  @ApiPropertyOptional({
    description: 'Statut de paiement',
    enum: LoungePaymentStatus,
    default: LoungePaymentStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(LoungePaymentStatus)
  paymentStatus?: LoungePaymentStatus;

  @ApiPropertyOptional({ description: 'Prénom du visiteur principal' })
  @IsOptional()
  @IsString()
  guestFirstName?: string;

  @ApiPropertyOptional({ description: 'Nom du visiteur principal' })
  @IsOptional()
  @IsString()
  guestLastName?: string;

  @ApiPropertyOptional({ description: 'Fonction du visiteur principal' })
  @IsOptional()
  @IsString()
  guestFunction?: string;

  @ApiPropertyOptional({ description: 'Téléphone du visiteur principal' })
  @IsOptional()
  @IsString()
  guestPhone?: string;

  @ApiPropertyOptional({ description: 'Organisation du visiteur principal' })
  @IsOptional()
  @IsString()
  guestOrganization?: string;

  @ApiPropertyOptional({ description: 'Nationalité du visiteur principal' })
  @IsOptional()
  @IsString()
  guestNationality?: string;

  @ApiPropertyOptional({ description: 'Compagnie aérienne' })
  @IsOptional()
  @IsString()
  airline?: string;

  @ApiPropertyOptional({ description: 'Numéro de vol' })
  @IsOptional()
  @IsString()
  flightNumber?: string;

  @ApiPropertyOptional({ description: 'Provenance du vol' })
  @IsOptional()
  @IsString()
  flightOrigin?: string;

  @ApiPropertyOptional({
    description: "Heure d'arrivée du vol",
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  flightArrivalTime?: Date;

  @ApiPropertyOptional({
    description: 'Liste des accompagnants',
    type: [Object],
  })
  @IsOptional()
  @IsArray()
  companions?: Record<string, unknown>[];
}

export class LoungeBookingSearchDto extends SearchDto {
  @ApiPropertyOptional({
    description: 'Filtrer les réservations par salon',
  })
  @IsOptional()
  @IsString()
  loungeId?: string;

  @ApiPropertyOptional({
    description: 'Filtrer les réservations par utilisateur',
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Filtrer les réservations par statut',
    enum: LoungeBookingStatus,
  })
  @IsOptional()
  @IsEnum(LoungeBookingStatus)
  bookingStatus?: LoungeBookingStatus;
}

export class UpdateLoungeBookingStatusDto {
  @ApiProperty({
    description: 'Nouveau statut de la réservation',
    enum: LoungeBookingStatus,
  })
  @IsEnum(LoungeBookingStatus)
  status: LoungeBookingStatus;

  @ApiPropertyOptional({ description: "Notes de traitement de l'admin" })
  @IsOptional()
  @IsString()
  adminNotes?: string;

  @ApiPropertyOptional({
    description: 'Statut de paiement mis à jour',
    enum: LoungePaymentStatus,
  })
  @IsOptional()
  @IsEnum(LoungePaymentStatus)
  paymentStatus?: LoungePaymentStatus;
}
