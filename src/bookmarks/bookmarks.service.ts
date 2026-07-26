import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@Injectable()
export class BookmarksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBookmarkDto) {
    if (dto.collectionId) {
      const col = await this.prisma.collection.findFirst({
        where: { id: dto.collectionId, userId },
      });
      if (!col) throw new NotFoundException('Collection not found');
    }
    return this.prisma.bookmark.create({
      data: {
        url: dto.url,
        title: dto.title,
        description: dto.description || dto.notes || null,
        userId,
        collectionId: dto.collectionId || null,
      },
    });
  }

  async findAll(userId: string, collectionId?: string, search?: string) {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
        ...(collectionId ? { collectionId } : {}),
        ...(search ? { title: { contains: search } } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const b = await this.prisma.bookmark.findFirst({ where: { id, userId } });
    if (!b) throw new NotFoundException('Bookmark not found');
    return b;
  }

  async update(userId: string, id: string, dto: UpdateBookmarkDto) {
    await this.findOne(userId, id);
    return this.prisma.bookmark.update({ 
      where: { id }, 
      data: {
        url: dto.url,
        title: dto.title,
        description: (dto as any).description || (dto as any).notes,
        collectionId: dto.collectionId,
      } 
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.bookmark.delete({ where: { id } });
  }
}