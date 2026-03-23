import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { VipLoungeController } from './vip-lounge.controller';
import { VipLoungeService } from './vip-lounge.service';

@Module({
  imports: [PrismaModule],
  controllers: [VipLoungeController],
  providers: [VipLoungeService],
})
export class VipLoungeModule {}
