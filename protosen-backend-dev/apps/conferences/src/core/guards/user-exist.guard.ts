import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';
import { api_code } from 'src/constants/api.codes';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class DoesUserExist implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const { email } = request.body;

    const userExists = await lastValueFrom(
      this.userService.getUser({
        email: email,
      }),
    );

    if (userExists && userExists.user) {
      throw new UnprocessableEntityException(api_code.MSG_201);
    }
    return true;
  }
}
