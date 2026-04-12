import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, ValidateIf } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf((o) => o.limit !== undefined) // Valider 'page' si 'limit' est défini
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf((o) => o.page !== undefined) // Valider 'limit' si 'page' est défini
  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit?: number;
}
