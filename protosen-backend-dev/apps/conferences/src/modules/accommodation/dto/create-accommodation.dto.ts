import {
  IsString,
  IsEmail,
  IsUrl,
  IsArray,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAccommodationDto {
  @ApiProperty({
    description: "Nom de l'hébergement",
    example: 'Hôtel Paradis',
  })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Numéro de téléphone', example: '+33612345678' })
  @IsString()
  phone: string;

  @ApiProperty({
    description: "Adresse de l'hébergement",
    example: '123 Rue de Paris, 75001 Paris, France',
  })
  @IsString()
  location: string;

  @ApiPropertyOptional({
    description: 'Lien maps des Coordonnées géographiques',
    example: 'https://maps.app.goo.gl/G3r9bMMNNSFhVsjc8',
  })
  @IsOptional()
  @IsUrl()
  geolocation: string;

  @ApiPropertyOptional({
    description: "Lien de réservation de l'hotel",
    example: 'https://www.booking.com/hotel/sn/dakar.fr.html',
  })
  @IsOptional()
  @IsUrl()
  reservationLink: string;

  @ApiProperty({
    description: 'Adresse email de contact',
    example: 'contact@hotelparadis.com',
  })
  @IsEmail()
  email: string;
}

export class AttachAccommodationConferenceDto {
  @ApiProperty({
    description: 'Identifiant de la demande de conférence',
  })
  @IsString()
  conferenceId: string;

  @ApiProperty({
    description: 'Liste des identifiants des hébergements',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, {
    message: "Il doit y avoir au moins un identifiant d'hébergement",
  })
  accommodationIds: string[];
}
