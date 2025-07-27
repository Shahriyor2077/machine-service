import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { prismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: prismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user=await this.prismaService.user.create({data:createUserDto});
    return user
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  findOne(id: number) {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    const user = await this.prismaService.user.findFirst({ where: { email } });
    if (!user) throw new NotFoundException("Foydalanuvchi topilmadi");
    return user;
  }

  async activateUser(link: string) {
    const user = await this.prismaService.user.updateMany({
      where: { activationLink: link },
      data: { isActivated: true },
    });
    if (user.count === 0) throw new NotFoundException("Link noto‘g‘ri");
    return { message: "Foydalanuvchi faollashtirildi" };
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
