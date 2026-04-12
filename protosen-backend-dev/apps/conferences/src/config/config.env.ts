import { plainToInstance, Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsEmail,
  validateSync,
  IsEnum,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  DATABASE_URL: string;

  @Type(() => Number)
  @IsInt()
  PORT: number;

  @IsEmail()
  MAIL_USER: string;

  @IsString()
  MAIL_PASSWORD: string;

  @IsString()
  EMAIL_SECRET: string;

  @IsString()
  MAIL_HOST: string;

  @IsString()
  BUCKET_NAME: string;

  @IsString()
  BUCKET_KEY: string;

  @IsString()
  BUCKET_SECRET: string;

  @IsString()
  BUCKET_REGION: string;

  @IsString()
  GRPC_API_KEY: string;

  @IsString()
  APP_URL: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  PAYDUNYA_MASTER_KEY: string;

  @IsString()
  PAYDUNYA_PRIVATE_KEY: string;

  @IsString()
  PAYDUNYA_TOKEN: string;

  @IsString()
  PAYDUNYA_PUBLIC_KEY: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
