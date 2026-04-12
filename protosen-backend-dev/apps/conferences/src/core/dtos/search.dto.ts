import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class SearchDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(255) // Longueur maximale pour la chaîne de recherche
  search?: string;
}
