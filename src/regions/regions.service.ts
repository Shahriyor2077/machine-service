import { Injectable } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { prismaService } from '../prisma/prisma.service';

@Injectable()
export class RegionsService {
  constructor(private readonly prismaService: prismaService){}
  create(createRegionDto: CreateRegionDto) {
    return this.prismaService.region.create({data: createRegionDto});
  }

  findAll() {
    return this.prismaService.region.findMany();
  }

  findOne(id: number) {
    return this.prismaService.region.findUnique({where: {id}});
  }

  update(id: number, updateRegionDto: UpdateRegionDto) {
    return this.prismaService.region.update({where:{id}, data: updateRegionDto});
  }

  remove(id: number) {
    return this.prismaService.region.delete({where:{id}});
  }
}
