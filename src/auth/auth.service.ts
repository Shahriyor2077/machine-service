import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { prismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../../generated/prisma';
import { CreateContextOptions } from 'vm';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaServer: prismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService
  ) {}

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

  async signup(createUserDto: CreateUserDto){
    const {email}=createUserDto
    const candidate=await this.prismaServer.user.findFirst({where: {email}})
    if(candidate){
        throw new ConflictException("Bunday email mavjud boshqa email kiriting")
    }
    const newUser=await this.userService.createUserByAdmin(createUserDto)

    
}




}
