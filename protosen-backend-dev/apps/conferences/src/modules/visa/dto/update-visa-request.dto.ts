import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import {
  CreateVisaRequestDto,
  IssueVisaRequestDto,
  ValidateVisaRequestDto,
  WithdrawVisaRequestDto,
} from './create-visa-request.dto';

export class UpdateVisaRequestDto extends PartialType(CreateVisaRequestDto) {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  automaticScore?: number;

  @IsOptional()
  @IsString()
  dpiAnalysis?: string;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

export class UpdateVisaValidationDto extends PartialType(ValidateVisaRequestDto) {}

export class UpdateVisaEmissionDto extends PartialType(IssueVisaRequestDto) {}

export class UpdateVisaWithdrawalDto extends PartialType(WithdrawVisaRequestDto) {}
