import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateParticipantDto } from './create-participant.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateParticipantDto extends PartialType(CreateParticipantDto) {}

export class RejectSubscriptionDto {
  @ApiProperty({
    description: 'Raison du rejet de la conférence',
    example: 'Non conforme aux attentes',
  })
  @IsString()
  @IsNotEmpty()
  rejectionReason: string;
}
