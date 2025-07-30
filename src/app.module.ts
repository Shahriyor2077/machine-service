import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { AdminModule } from './admin/admin.module';
import { CarModule } from './car/car.module';
import { CarHistoryModule } from './car_history/car_history.module';
import { DistrictModule } from './district/district.module';
import { RegionsModule } from './regions/regions.module';

@Module({
  imports: [ConfigModule.forRoot({envFilePath: ".env", isGlobal: true}), UsersModule, PrismaModule, AuthModule, MailModule, AdminModule, CarModule, CarHistoryModule, DistrictModule, RegionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
