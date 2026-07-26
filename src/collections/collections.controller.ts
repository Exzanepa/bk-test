import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UsersService } from '../users/users.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { BookmarksService } from '../bookmarks/bookmarks.service';

@UseGuards(JwtAuthGuard)
@Controller('collections')
export class CollectionsController {
  constructor(
    private collectionsService: CollectionsService,
    private usersService: UsersService,
    private bookmarksService: BookmarksService,
  ) {}

  @Post()
  async create(
    @CurrentUser() authUser: any,
    @Body() dto: CreateCollectionDto,
  ) {
    const auth0Id = authUser.sub || authUser.auth0Id;
    const email = authUser.email || authUser['https://bbl-candidate-test-api/email'] || `${auth0Id}@test.local`;
    const user = await this.usersService.findOrCreate(auth0Id, email);
    return this.collectionsService.create(user.id, dto.name);
  }

  @Get()
  async findAll(@CurrentUser() authUser: any) {
    const auth0Id = authUser.sub || authUser.auth0Id;
    const email = authUser.email || `${auth0Id}@test.local`;
    const user = await this.usersService.findOrCreate(auth0Id, email);
    return this.collectionsService.findAll(user.id);
  }

  @Get(':id')
  async findOne(
    @CurrentUser() authUser: any,
    @Param('id') id: string,
  ) {
    const auth0Id = authUser.sub || authUser.auth0Id;
    const email = authUser.email || `${auth0Id}@test.local`;
    const user = await this.usersService.findOrCreate(auth0Id, email);
    return this.collectionsService.findOne(user.id, id);
  }

  
  @Put(':id')
  async replace(
    @CurrentUser() authUser: any,
    @Param('id') id: string,
    @Body() dto: UpdateCollectionDto,
  ) {
    const auth0Id = authUser.sub || authUser.auth0Id;
    const email = authUser.email || `${auth0Id}@test.local`;
    const user = await this.usersService.findOrCreate(auth0Id, email);
    return this.collectionsService.update(user.id, id, dto.name!);
  }

  @Patch(':id')
  async update(
    @CurrentUser() authUser: any,
    @Param('id') id: string,
    @Body() dto: UpdateCollectionDto,
  ) {
    const auth0Id = authUser.sub || authUser.auth0Id;
    const email = authUser.email || `${auth0Id}@test.local`;
    const user = await this.usersService.findOrCreate(auth0Id, email);
    return this.collectionsService.update(user.id, id, dto.name!);
  }

  @Delete(':id')
  async remove(
    @CurrentUser() authUser: any,
    @Param('id') id: string,
  ) {
    const auth0Id = authUser.sub || authUser.auth0Id;
    const email = authUser.email || `${auth0Id}@test.local`;
    const user = await this.usersService.findOrCreate(auth0Id, email);
    return this.collectionsService.remove(user.id, id);
  }

  // §3.1.4 GET /collections/:id/bookmarks
  @Get(':id/bookmarks')
  async findBookmarks(
    @CurrentUser() authUser: any,
    @Param('id') id: string,
  ) {
    const auth0Id = authUser.sub || authUser.auth0Id;
    const email = authUser.email || `${auth0Id}@test.local`;
    const user = await this.usersService.findOrCreate(auth0Id, email);
    // ensure collection ,user first
    await this.collectionsService.findOne(user.id, id);
    return this.bookmarksService.findAll(user.id, id);
  }
}
