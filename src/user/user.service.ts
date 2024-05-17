import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    return this.prisma.user.findMany();
  }

  async readOne(id: number) {
    await this.exists(id);

    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: CreateUserDTO) {
    if (data.birthAt) {
      data.birthAt = new Date(data.birthAt);
    }

    return this.prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
      },
    });
  }

  async update(data: UpdateUserDTO, id: number) {
    await this.exists(id);

    if (data.birthAt) {
      data.birthAt = new Date(data.birthAt);
    }

    return this.prisma.user.update({
      data: data,
      where: { id },
    });
  }

  async delete(id: number) {
    await this.exists(id);

    return this.prisma.user.deleteMany({
      where: { id },
    });
  }

  async exists(id: number) {
    if (
      !(await this.prisma.user.count({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException(`O usuário com id ${id} não existe`);
    }
  }
}
