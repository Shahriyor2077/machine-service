import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { prismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../../generated/prisma';
import * as cookieParser from "cookie-parser";
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SigninUserDto } from '../users/dto/signin-user.dto';
import { MailService } from '../mail/mail.service';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { AdminController } from '../admin/admin.controller';
import { AdminLoginDto } from '../admin/dto/signin-admin.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: prismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly mailService: MailService
  ) {}

  async registerUser(dto: { email: string; full_name: string }) {
    const candidate = await this.prismaService.user.findFirst({
      where: { email: dto.email },
    });
    if (candidate) {
      throw new ConflictException("Foydalanuvchi mavjud");
    }
    const activationLink = uuidv4();

    const newUser = await this.prismaService.user.create({
      data: { ...dto, activationLink },
    });
    await this.mailService.sendMail(
      {
        email: dto.email,
        name: dto.full_name,
        activation_link: activationLink,
      },
      "user"
    );
    return { message: "Emailga tasdiqlash linki yuborildi" };
  }

  async activateUser(activationLink: string) {
    const user = await this.prismaService.user.findFirst({
      where: { activationLink },
    });

    if (!user) {
      throw new BadRequestException("Noto‘g‘ri tasdiqlash havolasi");
    }

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { isActivated: true },
    });

    return { message: "Profil muvaffaqiyatli faollashtirildi" };
  }

  async loginUser(email: string) {
    const user = await this.prismaService.user.findFirst({ where: { email } });

    if (!user || !user.isActivated) {
      throw new UnauthorizedException(
        "Foydalanuvchi topilmadi yoki tasdiqlanmagan"
      );
    }

    const tokens = await this.generateToken(user);

    return { ...tokens, user };
  }

  async refresh(refreshToken: string) {
    if(!refreshToken){
      throw new ForbiddenException("Refresh token mavjud emas")
    }
    const userData=this.jwtService.decode(refreshToken);
    const users=await this.prismaService.user.findUnique({where:{id:userData['id']}})
    const tokens=await this.generateToken(users);
    return {...tokens, user:users}

  }

  //admin
  async login(email: string) {
    const admin = await this.prismaService.admin.findFirst({
      where: { email },
    });

    if (!admin) {
      throw new NotFoundException("Admin topilmadi");
    }

    // Email orqali tasdiqlash yoki boshqa logika bo'lishi mumkin

    const payload = {
      sub: admin.id,
      role: "admin",
    };

    const access_token = this.jwtService.sign(payload);

    return {
      message: "Kirish muvaffaqiyatli",
      access_token,
      admin: {
        id: admin.id,
        full_name: admin.full_name,
        email: admin.email,
        phone: admin.phone,
      },
    };
  }

  async generateToken(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
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

  async activate(activationLink: string) {
    const user = await this.prismaService.user.findFirst({
      where: { activationLink: activationLink },
    });

    if (!user) {
      throw new UnauthorizedException("Noto'g'ri activation link");
    }

    if (user.isActivated) {
      return {
        message: "Foydalanuvchi allaqachon faollashtirilgan",
        isActive: true,
      };
    }

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        isActivated: true,
        activationLink: null,
      },
    });

    return {
      message: "Foydalanuvchi muvaffaqiyatli faollashtirildi!",
      isActivated: true,
    };
  }
}
