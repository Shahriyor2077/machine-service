import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { prismaService } from "../prisma/prisma.service";
import { User } from "../../generated/prisma";
import { MailService } from "../mail/mail.service";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: prismaService,
    private readonly mailService: MailService
  ) {}



  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;

    const candidate = await this.prismaService.user.findFirst({
      where: { email },
    });

    if (candidate) {
      throw new ConflictException("Email allaqachon mavjud");
    }

    const newUser = await this.prismaService.user.create({
      data: createUserDto,
    });

    return newUser; // <-- BU QATOR SHART! AuthService ichida ishlatish uchun
  }

  async createWithActivation(createUserDto: CreateUserDto) {
    const { email, full_name } = createUserDto;
    const candidate = await this.prismaService.user.findFirst({
      where: { email },
    });
    if (candidate) {
      throw new ConflictException("Email allaqachon mavjud");
    }
    const activationLink = uuidv4();
    const newUser = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        activationLink,
        isActivated: false,
      },
    });
    // Emailga tasdiqlash havolasi yuborish
    await this.mailService.sendMail({
      email,
      full_name,
      isActivated: activationLink,
    });
    return {
      message: "User yaratildi. Emailga tasdiqlash havolasi yuborildi!",
      userId: newUser.id,
    };
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
