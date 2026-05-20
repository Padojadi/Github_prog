import { Module } from '@nestjs/common';
import { ConferenceRequestService } from './conference-request.service';
import { ConferenceRequestController } from './conference-request.controller';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, PrismaModule],
  controllers: [ConferenceRequestController],
  providers: [ConferenceRequestService],
})
export class ConferenceRequestModule {}
