import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { prismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { MailService } from "../mail/mail.service";
import { Admin, User } from "../../generated/prisma";
import { JwtPayload, ResponseFields, Tokens } from "./common/types";
import { CreateUserDto } from "../users/dto";
import { v4 as uuidv4 } from "uuid";
import { SigninUserDto } from "../users/dto/signin-user.dto";
import * as bcrypt from "bcrypt";
import { AdminLoginDto } from "../admin/dto/signin-admin.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: prismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService
  ) {}

  async generateToken(user: User): Promise<Tokens> {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      isActivated: user.isActivated,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async signup(createUserDto: CreateUserDto) {
    const { email, full_name } = createUserDto;
    const candidate = await this.prismaService.user.findFirst({
      where: { email },
    });
    if (candidate) {
      throw new ConflictException("Bunday email mavjud boshqa email kiriting");
    }
    const activationLink = uuidv4();
    const newUser = await this.prismaService.user.create({
      data: {
        email,
        full_name,
        activationLink: activationLink,
        isActivated: false,
      },
    });
    // Emailga kod yuborish
    await this.mailService.sendMail({
      email,
      full_name: newUser.full_name,
      isActivated: activationLink,
    });
    return {
      message: "Yangi user qo'shildi. Emailga tasdiqlash kodi yuborildi!",
      userId: newUser.id,
    };
  }
  async activateUser(link: string) {
    const user = await this.prismaService.user.findFirst({
      where: { activationLink: link },
    });
    if (!user) {
      throw new UnauthorizedException("Link noto'g'ri");
    }
    if (user.isActivated) {
      return { message: "Hisob allaqachon faollashtirilgan" };
    }

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { isActivated: true },
    });
    return { message: "Hisob faollashtirildi" };
  }

  async signin(email: string) {
    const user = await this.prismaService.user.findFirst({ where: { email } });
    if (!user) {
      throw new UnauthorizedException("Bunday email mavjud emas");
    }
    if (!user.isActivated) {
      throw new UnauthorizedException("Hisob faollashtirilmagan");
    }
    const tokens = await this.generateToken(user);
    await this.prismaService.user.update({
      where: { id: user.id },
      data: { hashedRefreshToken: tokens.refreshToken },
    });
    return {
      message: "Kirish muvaffaqiyatli",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  // User login (faqat email va activationLink orqali)
  async userLogin(email: string, activationLink: string) {
    const user = await this.prismaService.user.findFirst({
      where: { email, activationLink },
    });
    if (!user) {
      throw new UnauthorizedException(
        "Email yoki aktivatsiya havolasi noto‘g‘ri"
      );
    }
    if (!user.isActivated) {
      throw new UnauthorizedException("Hisob faollashtirilmagan");
    }
    const tokens = await this.generateToken(user);
    await this.prismaService.user.update({
      where: { id: user.id },
      data: { hashedRefreshToken: tokens.refreshToken },
    });
    return {
      message: "Kirish muvaffaqiyatli",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  // ADMIN uchun

  async generateAdminToken(admin: Admin) {
    const payload = {
      id: admin.id,
      email: admin.email,
      is_creator: admin.is_creator,
      role: "admin",
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async adminLogin(dto: AdminLoginDto) {
    const admin = await this.prismaService.admin.findFirst({
      where: { email: dto.email },
    });

    if (!admin) {
      throw new UnauthorizedException("Email yoki parol noto‘g‘ri");
    }

    const isMatch = await bcrypt.compare(dto.password, admin.password);
    if (!isMatch) {
      throw new UnauthorizedException("Email yoki parol noto‘g‘ri");
    }

    const tokens = await this.generateAdminToken(admin);
    return {
      message: "Admin muvaffaqiyatli tizimga kirdi",
      tokens,
    };
  }
}
