import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [ConfigModule.forRoot({envFilePath: ".env", isGlobal: true}), UsersModule, PrismaModule, AuthModule, MailModule, AdminModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
