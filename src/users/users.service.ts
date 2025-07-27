import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { prismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: prismaService) {}
  async createUserByAdmin(dto: CreateUserDto) {
    const user = await this.prismaService.user.create({
      data: {
        full_name: dto.full_name,
        phone: dto.phone,
        email: dto.email,
        isActivated: dto.isActivated ?? false,
        is_approved: dto.is_approved ?? false,
        role: dto.role ?? "USER",
        refreshToken: dto.refreshToken,
        activationLink: dto.activationLink,
      },
    });
    return user;
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  findOne(id: number) {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prismaService.user.delete({ where: { id } });
  }
}
