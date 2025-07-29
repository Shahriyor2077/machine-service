import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { GetCurrentUser } from "../auth/common/decorators/get-current-user.decorator";
import { accessTokenGuard } from "../auth/common/guards";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(accessTokenGuard)
  async create(@GetCurrentUser() user, @Body() createUserDto: CreateUserDto) {
    if (!user.role || user.role.toUpperCase() !== "ADMIN") {
      throw new ForbiddenException("Faqat admin user qo‘sha oladi");
    }
    // User yaratishda emailga tasdiqlash havolasi yuboriladi
    return this.usersService.createWithActivation(createUserDto);
  }

  @Get()
  @UseGuards(accessTokenGuard)
  async findAll(@GetCurrentUser() user) {
    if (!user.role || user.role.toUpperCase() !== "ADMIN") {
      throw new ForbiddenException("Faqat admin barcha userlarni ko‘ra oladi");
    }
    return this.usersService.findAll();
  }

  @Get(":id")
  @UseGuards(accessTokenGuard)
  async findOne(@GetCurrentUser() user, @Param("id") id: string) {
    if (!user.role || user.role.toUpperCase() !== "ADMIN") {
      throw new ForbiddenException("Faqat admin userni ko‘ra oladi");
    }
    return this.usersService.findOne(+id);
  }

  @Patch(":id")
  @UseGuards(accessTokenGuard)
  async update(
    @GetCurrentUser() user,
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    if (!user.role || user.role.toUpperCase() !== "ADMIN") {
      throw new ForbiddenException("Faqat admin userni o‘zgartira oladi");
    }
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(":id")
  @UseGuards(accessTokenGuard)
  async remove(@GetCurrentUser() user, @Param("id") id: string) {
    if (!user.role || user.role.toUpperCase() !== "ADMIN") {
      throw new ForbiddenException("Faqat admin userni o‘chira oladi");
    }
    return this.usersService.remove(+id);
  }
}
