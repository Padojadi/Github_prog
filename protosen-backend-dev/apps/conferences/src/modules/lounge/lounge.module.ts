import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { LoungeController } from './lounge.controller';
import { LoungeService } from './lounge.service';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [LoungeController],
  providers: [LoungeService],
})
export class LoungeModule {}
