import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UsersService } from '../users/users.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@UseGuards(JwtAuthGuard)
@Controller('collections')
export class CollectionsController {
  constructor(
    private collectionsService: CollectionsService,
    private usersService: UsersService,
  ) {}

  @Post()
  async create(
    @CurrentUser() authUser: { auth0Id: string; email: string },
    @Body() dto: CreateCollectionDto,
  ) {
    const user = await this.usersService.findOrCreate(authUser.auth0Id, authUser.email);
    return this.collectionsService.create(user.id, dto.name);
  }

  @Get()
  async findAll(@CurrentUser() authUser: { auth0Id: string; email: string }) {
    const user = await this.usersService.findOrCreate(authUser.auth0Id, authUser.email);
    return this.collectionsService.findAll(user.id);
  }

  @Get(':id')
  async findOne(
    @CurrentUser() authUser: { auth0Id: string; email: string },
    @Param('id') id: string,
  ) {
    const user = await this.usersService.findOrCreate(authUser.auth0Id, authUser.email);
    return this.collectionsService.findOne(user.id, id);
  }

  @Patch(':id')
  async update(
    @CurrentUser() authUser: { auth0Id: string; email: string },
    @Param('id') id: string,
    @Body() dto: UpdateCollectionDto,
  ) {
    const user = await this.usersService.findOrCreate(authUser.auth0Id, authUser.email);
    return this.collectionsService.update(user.id, id, dto.name!);
  }

  @Delete(':id')
  async remove(
    @CurrentUser() authUser: { auth0Id: string; email: string },
    @Param('id') id: string,
  ) {
    const user = await this.usersService.findOrCreate(authUser.auth0Id, authUser.email);
    return this.collectionsService.remove(user.id, id);
  }
}