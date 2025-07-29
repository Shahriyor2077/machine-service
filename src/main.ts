import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import * as cookieParser from "cookie-parser";
import { prismaService } from "./prisma/prisma.service";

async function start() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  const config = app.get(ConfigService);
  app.use(cookieParser());
  const PORT = config.get<number>("PORT");

  // --- AVTOMAT ADMIN YARATISH ---
  const prisma = app.get(prismaService);
  const adminCount = await prisma.admin.count();
  if (adminCount === 0) {
    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.admin.create({
      data: {
        full_name: "Admin",
        phone: "998901234567",
        email: "admin@gmail.com",
        password: hashedPassword,
        is_creator: true,
      },
    });
    console.log("Avtomatik admin yaratildi: admin@gmail.com / admin123");
  }
  // --- AVTOMAT ADMIN YARATISH YAKUNI ---

  await app.listen(PORT ?? 3030, () => {
    console.log(`Server started at: http://localhost:${PORT}`);
  });
}
start();
