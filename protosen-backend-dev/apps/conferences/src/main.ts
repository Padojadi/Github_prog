import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    cors: true,
  });

  const API_VERSION = process.env.API_VERSION;
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: '*',
    credentials: true,
  });
  app.setGlobalPrefix(API_VERSION);
  app.use(express.urlencoded({ extended: true }));
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [
            `'self'`,
            'data:',
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [
            `'self'`,
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Protosen Conférences API')
    .setVersion('1.0')
    .addServer('http://localhost:5003', 'Local') // Environnement local
    .addServer('https://protosendev.gouv.sn/conferences-api', 'Development') // Environnement de test
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  if (configService.get('NODE_ENV') === 'development') {
    SwaggerModule.setup(`${API_VERSION}/doc-api`, app, document);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip out properties not expected by the DTO
      transform: true, // auto transform payload to dto instance
      // forbidNonWhitelisted: true, // throws an error if non-whitelisted values are provided
      //exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );
  const port = process.env.PORT;
  await app.listen(port, async () => {
    Logger.log(`Application is running on: ${await app.getUrl()}`);
    Logger.log(`Running in ${configService.get('NODE_ENV')} mode`);
  });
}
bootstrap();
