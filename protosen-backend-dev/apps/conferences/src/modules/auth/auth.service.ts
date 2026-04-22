import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../user/user.service';
import { User } from '../user/generated/user';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { buildLoginCodeEmailTemplate } from 'src/helpers/emailHelper';
import sendEmail from 'src/config/mail.config';
import { api_code } from 'src/constants/api.codes';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly prisma: PrismaService,
  ) {}
  async validateToken(token: string): Promise<User> {
    try {
      const response = await firstValueFrom(
        this.userService.getUserByToken(token),
      );
      return response;

      // return await lastValueFrom(this.dpctGrpcService.getUserByToken(token));
    } catch {
      return null;
    }
  }

  async sendLoginCode(id: string) {
    try {
      const participant = await this.prisma.participant.findUnique({
        where: { id },
      });
      const loginCode = Math.floor(100000 + Math.random() * 900000);
      await this.prisma.participant.update({
        where: { id },
        data: { loginCode: loginCode.toString() },
      });
      const htmlContent = buildLoginCodeEmailTemplate(loginCode);
      await sendEmail({
        to: participant.email,
        subject: 'Code de connexion',
        html: htmlContent,
      });
      return { message: 'Code de connexion envoyé avec succès' };
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_240);
    }
  }

  async confirmLogin(id: string, loginCode: number) {
    try {
      const participant = await this.prisma.participant.findUnique({
        where: { id },
      });

      if (!participant || Number(participant.loginCode) !== loginCode) {
        throw new BadRequestException(api_code.MSG_241);
      }

      await this.prisma.participant.update({
        where: { id },
        data: { loginCode: null },
      });

      const token = jwt.sign(
        { sub: participant.id }, // Charge utile minimale
        process.env.JWT_SECRET, // Clé secrète
        { expiresIn: '24h', algorithm: 'HS256' }, // Expiration et algorithme
      );

      return { message: 'Connexion confirmée avec succès', data: token };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new UnprocessableEntityException(api_code.MSG_242);
    }
  }
}
