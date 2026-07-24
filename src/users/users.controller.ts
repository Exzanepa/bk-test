import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UsersService } from './users.service';

@Controller('me')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMe(@CurrentUser() user: { auth0Id: string; email: string }) {
    return this.usersService.findOrCreate(user.auth0Id, user.email);
  }
}