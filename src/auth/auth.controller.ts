import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { Request, Response } from 'express';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  SignIn(@Body() data: AuthDTO, @Req() req: Request, @Res() resp: Response) {
    return this.authService.login(data, req, resp);
  }

  @Get('logout')
  SignOut(@Req() req: Request, @Res() res: Response) {
    return this.authService.logout(req, res);
  }
}
