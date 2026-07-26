import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CollectionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, name: string) {
    try {
      return await this.prisma.collection.create({
        data: { name, userId },
      });
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw new ConflictException('Collection name already exists');
      }
      throw e;
    }
  }

  async findAll(userId: string) {
    return this.prisma.collection.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const collection = await this.prisma.collection.findFirst({
      where: { id, userId },
    });
    if (!collection) throw new NotFoundException('Collection not found');
    return collection;
  }

  async update(userId: string, id: string, name: string) {
    await this.findOne(userId, id);
    return this.prisma.collection.update({
      where: { id },
      data: { name },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.collection.delete({ where: { id } });
  }
}