import {
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class VipTimeSlotDto {
  @ApiProperty({ example: '08:00' })
  @IsString()
  @IsNotEmpty()
  start: string;

  @ApiProperty({ example: '20:00' })
  @IsString()
  @IsNotEmpty()
  end: string;
}

export class CreateVipLoungeDto {
  @ApiProperty({ example: 'Salon Présidentiel A' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Salon VIP principal pour les délégations.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(2000)
  capacity: number;

  @ApiProperty({ example: 150000 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  hourlyRate: number;

  @ApiProperty({ example: 'AIBD - Terminal VIP' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiPropertyOptional({
    enum: ['active', 'maintenance', 'inactive'],
    default: 'active',
  })
  @IsOptional()
  @IsIn(['active', 'maintenance', 'inactive'])
  status?: 'active' | 'maintenance' | 'inactive';

  @ApiPropertyOptional({ type: [String], example: ['wifi', 'lounge-bar'] })
  @IsOptional()
  @IsArray()
  amenities?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['monday', 'tuesday', 'wednesday'],
  })
  @IsOptional()
  @IsArray()
  availableDays?: string[];

  @ApiPropertyOptional({
    type: [VipTimeSlotDto],
    example: [{ start: '08:00', end: '20:00' }],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VipTimeSlotDto)
  timeSlots?: VipTimeSlotDto[];

  @ApiPropertyOptional({ example: 'https://example.com/lounge.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class UpdateVipLoungeDto {
  @ApiPropertyOptional({ example: 'Salon Présidentiel A+' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Description mise à jour du salon.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(2000)
  capacity?: number;

  @ApiPropertyOptional({ example: 180000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  hourlyRate?: number;

  @ApiPropertyOptional({ example: 'AIBD - Zone VIP Nord' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ enum: ['active', 'maintenance', 'inactive'] })
  @IsOptional()
  @IsIn(['active', 'maintenance', 'inactive'])
  status?: 'active' | 'maintenance' | 'inactive';

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  amenities?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  availableDays?: string[];

  @ApiPropertyOptional({ type: [VipTimeSlotDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VipTimeSlotDto)
  timeSlots?: VipTimeSlotDto[];

  @ApiPropertyOptional({ example: 'https://example.com/lounge-new.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class CreateVipBookingDto {
  @ApiProperty({ example: '2b3f9255-e583-4d2d-9f06-83606efb43f9' })
  @IsUUID()
  loungeId: string;

  @ApiProperty({ example: '2026-03-25T10:00:00.000Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z' })
  @IsDateString()
  endTime: string;

  @ApiProperty({ example: 4 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  numGuests: number;

  @ApiPropertyOptional({ example: 'Prévoir service café + écran.' })
  @IsOptional()
  @IsString()
  specialRequests?: string;

  @ApiPropertyOptional({ enum: ['online', 'on_site'], default: 'on_site' })
  @IsOptional()
  @IsIn(['online', 'on_site'])
  paymentMethod?: 'online' | 'on_site';
}

export class UpdateVipBookingStatusDto {
  @ApiProperty({ enum: ['pending', 'confirmed', 'cancelled', 'completed'] })
  @IsIn(['pending', 'confirmed', 'cancelled', 'completed'])
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';

  @ApiPropertyOptional({ example: 'Validé par la cellule protocole.' })
  @IsOptional()
  @IsString()
  adminNotes?: string;
}

export class CreateVipAccessRequestDto {
  @ApiProperty({ example: 'Aminata' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'DIALLO' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'Conseiller diplomatique' })
  @IsString()
  @IsNotEmpty()
  function: string;

  @ApiProperty({ example: '+221770000000' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Ministère des Affaires étrangères' })
  @IsString()
  @IsNotEmpty()
  organization: string;

  @ApiProperty({ example: 'Sénégalaise' })
  @IsString()
  @IsNotEmpty()
  nationality: string;

  @ApiProperty({ example: 'Diplomatique' })
  @IsString()
  @IsNotEmpty()
  passportType: string;

  @ApiProperty({ example: 'P1234567' })
  @IsString()
  @IsNotEmpty()
  passportNumber: string;

  @ApiPropertyOptional({ example: 'Mission officielle de transit.' })
  @IsOptional()
  @IsString()
  travelPurpose?: string;

  @ApiPropertyOptional({ enum: ['Famille', 'Délégation', 'Autres', 'Aucun'] })
  @IsOptional()
  @IsIn(['Famille', 'Délégation', 'Autres', 'Aucun'])
  companionType?: 'Famille' | 'Délégation' | 'Autres' | 'Aucun';

  @ApiPropertyOptional({ example: 'Conjoint' })
  @IsOptional()
  @IsString()
  familyRelation?: string;

  @ApiPropertyOptional({ type: [Object], example: [{ nom: 'Ndiaye' }] })
  @IsOptional()
  @IsArray()
  familyMembers?: Record<string, unknown>[];

  @ApiPropertyOptional({ type: [Object], example: [{ nom: 'Ba' }] })
  @IsOptional()
  @IsArray()
  delegationMembers?: Record<string, unknown>[];

  @ApiPropertyOptional({ example: 'Air Senegal' })
  @IsOptional()
  @IsString()
  airline?: string;

  @ApiPropertyOptional({ example: 'HC102' })
  @IsOptional()
  @IsString()
  flightNumber?: string;

  @ApiPropertyOptional({ example: 'Paris CDG' })
  @IsOptional()
  @IsString()
  flightOrigin?: string;

  @ApiPropertyOptional({ example: '2026-03-26T09:30:00.000Z' })
  @IsOptional()
  @IsDateString()
  flightArrivalTime?: string;

  @ApiProperty({ example: '2026-03-26T10:00:00.000Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ example: '2026-03-26T12:00:00.000Z' })
  @IsDateString()
  endTime: string;

  @ApiPropertyOptional({ example: 'Présence de 2 invités supplémentaires.' })
  @IsOptional()
  @IsString()
  specialRequests?: string;
}

export class UpdateVipAccessRequestStatusDto {
  @ApiProperty({ enum: ['pending', 'approved', 'rejected'] })
  @IsIn(['pending', 'approved', 'rejected'])
  status: 'pending' | 'approved' | 'rejected';

  @ApiPropertyOptional({ example: "Validé après vérification de l'identité." })
  @IsOptional()
  @IsString()
  adminNotes?: string;
}
