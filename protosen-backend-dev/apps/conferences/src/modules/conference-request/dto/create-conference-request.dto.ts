import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RejectConferenceDto {
  @ApiProperty({
    description: 'Raison du rejet de la conférence',
    example: 'Non conforme aux attentes',
  })
  @IsString()
  @IsNotEmpty()
  rejectionReason: string;
}

export class RejectPermanentlyConferenceDto {
  @ApiProperty({
    description: 'Raison du rejet permanent de la conférence',
    example: 'Violation des règles internes',
  })
  @IsString()
  @IsNotEmpty()
  rejectionReason: string;
}
