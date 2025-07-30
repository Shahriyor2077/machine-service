import { Injectable } from "@nestjs/common";
import { CreateCarHistoryDto } from "./dto/create-car_history.dto";
import { UpdateCarHistoryDto } from "./dto/update-car_history.dto";
import { prismaService } from "../prisma/prisma.service";

@Injectable()
export class CarHistoryService {
  constructor(private readonly prismaService: prismaService) {}
  create(createCarHistoryDto: CreateCarHistoryDto) {
    return this.prismaService.carHistory.create({
      data: {
        car_id: createCarHistoryDto.car_id,
        owner_id: createCarHistoryDto.owner_id,
        buyout_id: createCarHistoryDto.buyout_id,
        sold_at: createCarHistoryDto.sold_at,
      },
    });
  }

  findAll() {
    return this.prismaService.carHistory.findMany();
  }

  findOne(id: number) {
    return this.prismaService.carHistory.findUnique({ where: { id } });
  }

  update(id: number, updateCarHistoryDto: UpdateCarHistoryDto) {
    return this.prismaService.carHistory.update({
      where: { id },
      data: updateCarHistoryDto,
    });
  }

  remove(id: number) {
    return this.prismaService.carHistory.delete({ where: { id } });
  }
}
