import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { SkipAuth } from 'src/core/decorators/skipauth.decorator';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('participant/:id/send-login-code')
  @SkipAuth()
  @ApiOperation({ summary: 'Envoyer le code de connexion' })
  async sendLoginCode(@Param('id') id: string) {
    return this.authService.sendLoginCode(id);
  }

  @Post('participant/:id/confirm-login')
  @SkipAuth()
  @ApiOperation({ summary: 'Confirmer le code de connexion' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        code: { type: 'integer', description: 'Code de connexion' },
      },
      required: ['code'],
    },
  })
  async confirmLogin(
    @Param('id') id: string,
    @Body('code', ParseIntPipe) code: number,
  ) {
    return this.authService.confirmLogin(id, code);
  }
}
