import { Controller, Get, Post, Body, Patch, Put, Param, Delete, UseGuards, Req, Query, NotFoundException } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('bookmarks')
@UseGuards(JwtAuthGuard)
export class BookmarksController {
  constructor(
    private readonly bookmarksService: BookmarksService,
    private readonly prisma: PrismaService,
  ) {}

  private async getUserId(auth0Id: string) {
    const user = await this.prisma.user.findUnique({ where: { auth0Id } });
    if (!user) throw new NotFoundException('User not found - run seed');
    return user.id;
  }

  @Post()
  async create(@Req() req: any, @Body() dto: CreateBookmarkDto) {
    const userId = await this.getUserId(req.user.sub);
    return this.bookmarksService.create(userId, dto);
  }

  @Get()
  async findAll(@Req() req: any, @Query('collectionId') collectionId?: string, @Query('search') search?: string) {
    const userId = await this.getUserId(req.user.sub);
    return this.bookmarksService.findAll(userId, collectionId, search);
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    const userId = await this.getUserId(req.user.sub);
    return this.bookmarksService.findOne(userId, id);
  }

  @Put(':id')
  async updatePut(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateBookmarkDto) {
    const userId = await this.getUserId(req.user.sub);
    return this.bookmarksService.update(userId, id, dto);
  }

  @Patch(':id')
  async updatePatch(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateBookmarkDto) {
    const userId = await this.getUserId(req.user.sub);
    return this.bookmarksService.update(userId, id, dto);
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    const userId = await this.getUserId(req.user.sub);
    return this.bookmarksService.remove(userId, id);
  }
}