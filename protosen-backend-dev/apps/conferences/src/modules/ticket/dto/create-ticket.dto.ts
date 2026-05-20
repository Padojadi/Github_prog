import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsString,
  IsOptional,
  IsInt,
  ValidateIf,
  Min,
} from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({ description: 'Identifiant de la conférence associée' })
  @IsUUID()
  conferenceId: string;

  @ApiProperty({ description: 'Nom du ticket' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Description du ticket',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Thème de couleurs du ticket',
    required: false,
  })
  @IsString()
  @IsOptional()
  colorTheme?: string;

  @ApiProperty({ description: 'Prix du ticket' })
  @IsInt()
  @ValidateIf((obj) => obj.price !== 0)
  @Min(250, { message: 'Le prix doit être 0 ou supérieur ou égal à 250.' })
  price: number;
}
