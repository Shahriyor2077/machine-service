import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { prismaService } from '../prisma/prisma.service';
import * as bcrypt from "bcrypt";
import { promiseHooks } from 'v8';
import { emitWarning } from 'process';

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: prismaService) {}

  async create(createAdminDto: CreateAdminDto) {
    const hashedPassword=await bcrypt.hash(createAdminDto.password, 7)
    return this.prismaService.admin.create({data:{
      full_name: createAdminDto.full_name,
      phone: createAdminDto.phone,
      email: createAdminDto.email,
      password: hashedPassword,
      is_creator: createAdminDto.is_creator
    }})
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
