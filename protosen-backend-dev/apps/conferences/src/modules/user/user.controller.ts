import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { User, UsersResponse, UserResponse } from './generated/user';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 🔹 Récupérer un utilisateur par Token
  @Get('token/:token')
  getUserByToken(@Param('token') token: string): Observable<User> {
    return this.userService.getUserByToken(token);
  }

  // 🔹 Récupérer un utilisateur par ID ou Email
  @Get()
  getUser(
    @Query() query: { id?: string; email?: string },
  ): Observable<UserResponse> {
    return this.userService.getUser(query);
  }

  // 🔹 Récupérer plusieurs utilisateurs par IDs
  @Get('multiple')
  getUsersByIds(@Query('ids') ids: string): Observable<UsersResponse> {
    const idArray = ids.split(',');
    return this.userService.getUsersByIds(idArray);
  }
}
