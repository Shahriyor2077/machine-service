import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';


@Injectable()
export class prismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(){
        super({
            datasources:{
                db:{
                    url: process.env.DATABASE_URL,
                }
            }
        })
    }

    async onModuleInit() {
        await this.$connect()
    }
    async onModuleDestroy() {
        await this.$disconnect()
    }

}
