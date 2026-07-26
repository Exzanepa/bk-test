import { Controller, Get, Query, Res, Req, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import * as crypto from 'crypto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';

function base64URLEncode(str: Buffer) {
  return str.toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
}

@Controller()
export class AuthController {
  @Get('auth/login')
  login(@Res() res: Response) {
    const verifier = base64URLEncode(crypto.randomBytes(32));
    const challenge = base64URLEncode(crypto.createHash('sha256').update(verifier).digest());
    const state = base64URLEncode(crypto.randomBytes(16));

    res.cookie('pkce_verifier', verifier, { httpOnly: true, sameSite: 'lax' });
    res.cookie('auth_state', state, { httpOnly: true, sameSite: 'lax' });

    const params = new URLSearchParams({
      client_id: process.env.AUTH0_CLIENT_ID!,
      response_type: 'code',
      scope: 'openid profile email',
      audience: process.env.AUTH0_AUDIENCE!,
      redirect_uri: process.env.CALLBACK_URL!,
      code_challenge: challenge,
      code_challenge_method: 'S256',
      state,
    });
    const url = `https://${process.env.AUTH0_DOMAIN}/authorize?${params}`;
    return res.redirect(url);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Query('state') state: string, @Req() req: any, @Res() res: Response) {
    const verifier = req.cookies?.pkce_verifier;
    const savedState = req.cookies?.auth_state;
    if(state !== savedState) return res.status(400).send('Invalid state');

    const tokenRes = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.AUTH0_CLIENT_ID!,
        code,
        redirect_uri: process.env.CALLBACK_URL!,
        code_verifier: verifier,
      }),
    });
    const tokens = await tokenRes.json();
    
    return res.redirect(`${process.env.FRONTEND_URL}/auth/callback?access_token=${tokens.access_token}&id_token=${tokens.id_token}`);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: any) {
    return {
      sub: user.sub,
      email: user.email,
      name: user.name,
      aud: user.aud,
    };
  }
}