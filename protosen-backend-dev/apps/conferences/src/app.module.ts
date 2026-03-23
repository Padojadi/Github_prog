import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConferenceModule } from './modules/conference/conference.module';
import { PrismaModule } from './config/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/config.env';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { RolesGuard } from './core/guards/roles.guard';
import { AuthGuard } from './core/guards/jwtauth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { ConferenceRequestModule } from './modules/conference-request/conference-request.module';
import { AccommodationModule } from './modules/accommodation/accommodation.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { ParticipantModule } from './modules/participant/participant.module';
import { InstitutionModule } from './modules/institution/institution.module';
import { UserModule } from './modules/user/user.module';
import { ReferentielsModule } from './modules/referentiels/referentiels.module';
import { VipLoungeModule } from './modules/vip-lounge/vip-lounge.module';

@Module({
  imports: [
    ConferenceModule,
    ConfigModule.forRoot({
      validate: validateEnv,
      envFilePath: '.env',
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    FileUploadModule,
    ConferenceRequestModule,
    AccommodationModule,
    TicketModule,
    ParticipantModule,
    InstitutionModule,
    UserModule,
    ReferentielsModule,
    VipLoungeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
