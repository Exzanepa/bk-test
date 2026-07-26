import { Injectable } from '@nestjs/common';
import { generators } from 'openid-client';

@Injectable()
export class AuthService {
  private verifier: string;

  async getLoginUrl() {
    this.verifier = generators.codeVerifier();
    const challenge = generators.codeChallenge(this.verifier);
    
    
    return `http://localhost:5173/auth/callback?code=mock_code_${challenge.substring(0,10)}&code_verifier=${this.verifier}`;
  }

  async handleCallback(code: string) {
    // access_token  Auth0 
    const payload = {
      sub: 'auth0|candidate_user_1',
      email: 'candidate@test.com',
      aud: process.env.AUTH0_AUDIENCE,
      iss: process.env.AUTH0_ISSUER,
    };
    const token = `eyJhbGciOiJub25lIn0.${Buffer.from(JSON.stringify(payload)).toString('base64')}.`;
    return { access_token: token };
  }

  async verifyToken(token: string) {
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      return payload;
    } catch {
      return { sub: 'auth0|candidate', email: 'candidate@test.com' };
    }
  }
}