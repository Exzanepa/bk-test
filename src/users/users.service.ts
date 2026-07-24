import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOrCreate(auth0Id: string, email: string) {
    let user = await this.prisma.user.findUnique({ 
      where: { auth0Id } 
    });
    
    if (!user) {
      user = await this.prisma.user.create({
        data: { 
          auth0Id, 
          email 
        },
      });
    }
    return user;
  }

  async findByAuth0Id(auth0Id: string) {
    return this.prisma.user.findUnique({ where: { auth0Id } });
  }
}