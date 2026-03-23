import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/skipauth.decorator';
import { api_code } from 'src/constants/api.codes';
import { lastValueFrom } from 'rxjs';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (isPublic) {
        return true;
      }
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedException(api_code.MSG_235);
      }

      const token = authHeader.split(' ')[1]; // Extrait le token du header "Bearer <token>"

      if (!token) {
        throw new UnauthorizedException(api_code.MSG_236);
      }

      const user = await lastValueFrom(this.userService.getUserByToken(token));
      if (!user || !user.confirmed) {
        throw new UnauthorizedException(api_code.MSG_237);
      }

      request.user = user; // Ajoute l'utilisateur dans la requête
      return true;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException(api_code.MSG_237);
    }
  }
}
