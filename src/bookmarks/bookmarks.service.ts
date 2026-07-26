import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: { url: string; title?: string; description?: string; collectionId: string }) {
    // 1. Validate collection is mine
    const collection = await this.prisma.collection.findFirst({
      where: { id: dto.collectionId, userId },
    });
    if (!collection) throw new ForbiddenException('Collection not found or not yours');

    return this.prisma.bookmark.create({
      data: {
        url: dto.url,
        title: dto.title || dto.url,
        description: dto.description,
        collectionId: dto.collectionId,
        userId,
      },
    });
  }

  async findAll(userId: string, collectionId?: string) {
    return this.prisma.bookmark.findMany({
      where: { userId,...(collectionId && { collectionId }) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: { id, userId },
    });
    if (!bookmark) throw new NotFoundException('Bookmark not found');
    return bookmark;
  }

  async update(userId: string, id: string, dto: any) {
    await this.findOne(userId, id);

    if (dto.collectionId) {
      const collection = await this.prisma.collection.findFirst({
        where: { id: dto.collectionId, userId },
      });
      if (!collection) throw new ForbiddenException('Target collection not yours');
    }

    return this.prisma.bookmark.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.bookmark.delete({ where: { id } });
  }
}