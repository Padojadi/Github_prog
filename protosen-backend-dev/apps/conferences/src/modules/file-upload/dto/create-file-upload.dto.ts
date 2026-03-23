import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFileUploadDto {
  @ApiProperty({ description: 'Nom du fichier' })
  @IsString()
  filename: string;

  @ApiPropertyOptional({
    description: 'Type de contenu du fichier (MIME type)',
  })
  @IsString()
  @IsOptional()
  contentType?: string;
}
