import { Module } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { ParticipantController } from './participant.controller';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FileUploadModule } from '../file-upload/file-upload.module';

@Module({
  imports: [ScheduleModule.forRoot(), FileUploadModule, PrismaModule],
  controllers: [ParticipantController],
  providers: [ParticipantService],
})
export class ParticipantModule {}
