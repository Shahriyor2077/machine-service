// import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { CreateUserDto } from '../users/dto/create-user.dto';
// import { SigninUserDto } from '../users/dto/signin-user.dto';
// import { AdminLoginDto } from '../admin/dto/signin-admin.dto';

// @Controller("auth")
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Get("activate/:link")
//   async activate(@Param("link") activationLink: string) {
//     return this.authService.activate(activationLink);
//   }

//   // Admin uchun
//   @Post('login')
//   login(@Body('email') email: string) {
//     return this.authService.login(email);
//   }
// }


// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: { email: string; name: string }) {
    return this.authService.registerUser(dto);
  }

  @Get('activate/:link')
  async activate(@Param('link') activationLink: string){
    return this.authService.activateUser(activationLink);
  }

  @Post('login')
  async login(
    @Body() body: { email: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.loginUser(body.email);
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return data;
  }

  @Post('logout')

  async logout(@Res({passthrough:true}) res:Response){
    res.clearCookie('refreshToken');
    return {message:"Logout bajarildi"}
  }


  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies['refreshToken'];
    const data = await this.authService.refresh(token);
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return data;
  }
}
