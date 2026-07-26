import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('collections')
@UseGuards(JwtAuthGuard)
export class CollectionsController {
  constructor(
    private readonly collectionsService: CollectionsService,
    private readonly prisma: PrismaService,
  ) {}

  private async getUserId(auth0Id: string) {
    const user = await this.prisma.user.findUnique({ where: { auth0Id } });
    if (!user) throw new NotFoundException('User not found - run seed');
    return user.id;
  }

  @Post()
  async create(@Req() req: any, @Body() body: any) {
    const userId = await this.getUserId(req.user.sub);
    const name = body.name;
    return this.collectionsService.create(userId, name);
  }

  @Get()
  async findAll(@Req() req: any) {
    const userId = await this.getUserId(req.user.sub);
    return this.collectionsService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    const userId = await this.getUserId(req.user.sub);
    return this.collectionsService.findOne(userId, id);
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    const userId = await this.getUserId(req.user.sub);
    return this.collectionsService.remove(userId, id);
  }
}