import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { prismaService } from '../prisma/prisma.service';
import * as bcrypt from "bcrypt";

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: prismaService) {}

  async create(createAdminDto: CreateAdminDto) {
    const admin = await this.prismaService.admin.create({
      data: createAdminDto,
    });
    return admin;
  }

  findAll() {
    return this.prismaService.admin.findMany();
  }

  async findByEmail(email: string) {
    const admin = await this.prismaService.admin.findFirst({
      where: { email },
    });
    return admin;
  }

  findOne(id: number) {
    return this.prismaService.admin.findUnique({ where: { id } });
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return this.prismaService.admin.update({
      where: { id },
      data: updateAdminDto,
    });
  }

  remove(id: number) {
    return this.prismaService.admin.delete({ where: { id } });
  }
}
