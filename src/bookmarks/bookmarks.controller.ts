import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UsersService } from '../users/users.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@UseGuards(JwtAuthGuard)
@Controller('bookmarks')
export class BookmarksController {
  constructor(
    private bookmarksService: BookmarksService,
    private usersService: UsersService,
  ) {}

  @Post()
  async create(@CurrentUser() authUser: any, @Body() dto: CreateBookmarkDto) {
    const user = await this.usersService.findOrCreate(authUser.auth0Id, authUser.email);
    return this.bookmarksService.create(user.id, dto);
  }

  @Get()
  async findAll(@CurrentUser() authUser: any, @Query('collectionId') collectionId?: string) {
    const user = await this.usersService.findOrCreate(authUser.auth0Id, authUser.email);
    return this.bookmarksService.findAll(user.id, collectionId);
  }

  @Get(':id')
  async findOne(@CurrentUser() authUser: any, @Param('id') id: string) {
    const user = await this.usersService.findOrCreate(authUser.auth0Id, authUser.email);
    return this.bookmarksService.findOne(user.id, id);
  }

  @Patch(':id')
  async update(@CurrentUser() authUser: any, @Param('id') id: string, @Body() dto: UpdateBookmarkDto) {
    const user = await this.usersService.findOrCreate(authUser.auth0Id, authUser.email);
    return this.bookmarksService.update(user.id, id, dto);
  }

  @Delete(':id')
  async remove(@CurrentUser() authUser: any, @Param('id') id: string) {
    const user = await this.usersService.findOrCreate(authUser.auth0Id, authUser.email);
    return this.bookmarksService.remove(user.id, id);
  }
}