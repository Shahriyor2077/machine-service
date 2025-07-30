import { Injectable } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { prismaService } from '../prisma/prisma.service';

@Injectable()
export class CarService {
  constructor(private readonly prismaService: prismaService){}
  create(createCarDto: CreateCarDto) {
    return this.prismaService.car.create({
      data: createCarDto
    })
  }

  findAll() {
    return this.prismaService.car.findMany();
  }

  findOne(id: number) {
    return this.prismaService.car.findUnique({where:{id}});
  }

  update(id: number, updateCarDto: UpdateCarDto) {
    return this.prismaService.car.update({where:{id}, data:updateCarDto});
  }

  remove(id: number) {
    return this.prismaService.car.delete({where:{id}});
  }
}
