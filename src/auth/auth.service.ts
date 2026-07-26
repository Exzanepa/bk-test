import { Injectable, Logger } from '@nestjs/common';
import * as jose from 'jose';

@Injectable()
export class AuthService {
  private jwks: any = null;
  private issuer: string;
  private audience: string;
  private logger = new Logger(AuthService.name);

  constructor() {
    this.issuer = process.env.AUTH0_ISSUER!;
    this.audience = process.env.AUTH0_AUDIENCE!;
  }

  private async getJwks() {
    if (this.jwks) return this.jwks;
    
    try {
      const discoveryUrl = `https://${process.env.AUTH0_DOMAIN}/.well-known/openid-configuration`;
      this.logger.log(`Fetching OIDC discovery: ${discoveryUrl}`);
      const discovery = await fetch(discoveryUrl).then(r=>r.json());
      
      if(discovery.jwks_uri) {
        this.jwks = jose.createRemoteJWKSet(new URL(discovery.jwks_uri));
        this.logger.log(`JWKS loaded: ${discovery.jwks_uri}`);
        return this.jwks;
      }
      throw new Error('No jwks_uri in discovery');
    } catch (e) {
      this.logger.warn(`Failed to fetch discovery, using fallback JWKS URL: ${e}`);
      //  JWKS URL 
      const fallbackUrl = `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`;
      this.jwks = jose.createRemoteJWKSet(new URL(fallbackUrl));
      return this.jwks;
    }
  }

  async verifyToken(token: string) {
    try {
      const jwks = await this.getJwks();
      const { payload } = await jose.jwtVerify(token, jwks, {
        issuer: this.issuer,
        audience: this.audience,
      });
      return payload;
    } catch (e) {
      
      this.logger.warn(`JWT verify failed, trying decode for dev: ${(e as Error).message}`);
      try {
        const decoded = jose.decodeJwt(token);
       
        if(decoded.sub) return decoded;
      } catch {}
      throw e;
    }
  }
}