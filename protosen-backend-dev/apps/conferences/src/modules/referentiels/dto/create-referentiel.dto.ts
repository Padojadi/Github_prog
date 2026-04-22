import { IsString, Length } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateFunctionDto {
  @ApiProperty({ example: 'Responsable RH', description: 'Nom de la fonction' })
  @IsString()
  @Length(2, 100)
  name: string;
}

export class CreateSupportDto {
  @ApiProperty({
    example: 'Prise en charge par l’entreprise',
    description: 'Type de prise en charge',
  })
  @IsString()
  @Length(2, 100)
  label: string;
}

export class CreateParticipantTypeDto {
  @ApiProperty({
    example: 'Invité VIP',
    description: 'Libellé de la catégorie de participant',
  })
  @IsString()
  @Length(2, 100)
  label: string;

  @ApiProperty({
    example: 'Catégorie pour les invités spéciaux',
    description: 'Description de la catégorie de participant',
    required: false,
  })
  @IsString()
  @Length(0, 255)
  description?: string;
}

export class UpdateFunctionDto extends PartialType(CreateFunctionDto) {}
export class UpdateSupportDto extends PartialType(CreateSupportDto) {}
export class UpdateParticipantTypeDto extends PartialType(
  CreateParticipantTypeDto,
) {}
