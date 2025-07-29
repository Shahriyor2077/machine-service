import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";

import { Response, Request } from "express";
import { RefreshTokenGuard } from "./common/guards";
import { GetCurrentUser, GetCurrentUserId } from "./common/decorators";
import { ref } from "process";
import { ResponseFields } from "./common/types";
import { AuthGuard } from "@nestjs/passport";
import { CreateUserDto } from "../users/dto";
import { access } from "fs";
import { AdminLoginDto } from "../admin/dto/signin-admin.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Get("activate/:link")
  activate(@Param("link") link: string) {
    return this.authService.activateUser(link);
  }

  @Post("signin")
  signin(@Body("email") email: string) {
    return this.authService.signin(email);
  }

  //ADMIN uchun

  @Post("admin/login")
  async loginAdmin(@Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(dto);
  }

  // User login (faqat email va activationLink orqali)
  @Post("user/login")
  async userLogin(
    @Body("email") email: string,
    @Body("activationLink") activationLink: string
  ) {
    return this.authService.userLogin(email, activationLink);
  }
}
