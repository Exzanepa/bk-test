import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers.authorization;
    if(!auth?.startsWith('Bearer ')) throw new UnauthorizedException('Missing Bearer token');
    const token = auth.split(' ')[1];
    try {
      const payload = await this.authService.verifyToken(token);
      req.user = payload;
      return true;
    } catch(e) {
      throw new UnauthorizedException('Invalid token: '+(e as Error).message);
    }
  }
}