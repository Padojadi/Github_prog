import { z } from 'zod';
import { config as dotenvConfig } from 'dotenv';

// Don't override existing environment variables (e.g., from Docker)
dotenvConfig({ override: false });

const envSchema = z.object({
	// Environment
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
	PORT: z.string().regex(/^\d+$/, 'PORT must be a number').default('5002'),
	LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),

	// Database PostgreSQL
	POSTGRES_DB: z.string().min(1, 'POSTGRES_DB is required'),
	POSTGRES_USER: z.string().min(1, 'POSTGRES_USER is required'),
	POSTGRES_PASSWORD: z.string().min(1, 'POSTGRES_PASSWORD is required'),
	POSTGRES_HOST: z.string().min(1, 'POSTGRES_HOST is required'),
	POSTGRES_PORT: z.string().regex(/^\d+$/, 'POSTGRES_PORT must be a number').default('5432'),

	// JWT Authentication
	ACCESS_TOKEN_PUBLIC_KEY: z.string().min(1, 'ACCESS_TOKEN_PUBLIC_KEY is required'),
	ACCESS_TOKEN_PRIVATE_KEY: z.string().min(1, 'ACCESS_TOKEN_PRIVATE_KEY is required'),
	REFRESH_PUBLIC_KEY: z.string().min(1, 'REFRESH_PUBLIC_KEY is required'),
	REFRESH_PRIVATE_KEY: z.string().min(1, 'REFRESH_PRIVATE_KEY is required'),
	JWT_EXPIRES_IN: z.string().min(1, 'JWT_EXPIRES_IN is required'),
	JWT_REFRESH_EXPIRES_IN: z.string().min(1, 'JWT_REFRESH_EXPIRES_IN is required'),

	// AWS S3
	ACCESS_KEY: z.string().min(1, 'ACCESS_KEY is required'),
	SECRET_KEY: z.string().min(1, 'SECRET_KEY is required'),
	BUCKET_NAME: z.string().min(1, 'BUCKET_NAME is required'),
	BUCKET_REGION: z.string().min(1, 'BUCKET_REGION is required'),

	// Mail
	MAIL_HOST: z.string().min(1, 'MAIL_HOST is required'),
	MAIL_USER: z.string().min(1, 'MAIL_USER is required'),
	MAIL_PASS: z.string().min(1, 'MAIL_PASS is required'),
	MAIL_SERVICE: z.string().optional(),
	MAIL_PORT: z.string().regex(/^\d+$/, 'MAIL_PORT must be a number').optional(),

	// gRPC
	GRPC_PORT: z.string().regex(/^\d+$/, 'GRPC_PORT must be a number').default('50051'),
	GRPC_API_KEY: z.string().min(1, 'GRPC_API_KEY is required'),
	GRPC_ENABLE_REFLECTION: z.enum(['true', 'false']).default('false'),

	// Security / CORS
	CORS_ALLOWED_ORIGINS: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

function validateEnv(): EnvConfig {
	const result = envSchema.safeParse(process.env);

	if (!result.success) {
		console.error('❌ Invalid environment variables:');
		result.error.issues.forEach((issue) => {
			console.error(`   - ${issue.path.join('.')}: ${issue.message}`);
		});
		process.exit(1);
	}

	return result.data;
}

export const env = validateEnv();

export default env;
