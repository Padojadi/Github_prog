import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { api_code } from 'src/constants/api.codes';

@Injectable()
export class ParticipantTokenAuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers['x-conference-participant-bearer'] as string;

    if (!token) {
      throw new UnauthorizedException(
        'x-conference-participant-bearer manquant',
      );
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET) as {
        sub: string;
      };
      const participant = await this.prisma.participant.findUnique({
        where: { id: payload.sub },
      });

      if (!participant) {
        throw new UnauthorizedException(api_code.MSG_243);
      }
      (request as any).participant = participant;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException(
        'x-conference-participant-bearer invalide',
      );
    }
  }
}
