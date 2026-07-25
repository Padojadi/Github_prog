import { Module } from '@nestjs/common';
import { ReferentielsService } from './referentiels.service';
import { ReferentielsController } from './referentiels.controller';
import { PrismaModule } from 'src/config/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReferentielsController],
  providers: [ReferentielsService],
})
export class ReferentielsModule {}
