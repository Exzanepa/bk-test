import { Controller, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  async login(@Res() res: Response) {
    const url = await this.authService.getLoginUrl();
    res.redirect(url);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    const tokens = await this.authService.handleCallback(code);
   
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?access_token=${tokens.access_token}`);
  }

  @Get('logout')
  logout(@Res() res: Response) {
    res.redirect(`${process.env.FRONTEND_URL}`);
  }
}