import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
    console.log('📦 Database connected successfully');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('📦 Database disconnected');
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') return;

    const modelKeys = Object.keys(this).filter(
      (key) => typeof (this as any)[key]?.deleteMany === 'function'
    );

    return Promise.all(
      modelKeys.map((modelKey) =>
        (
          (this as any)[modelKey] as { deleteMany: () => Promise<unknown> }
        ).deleteMany()
      )
    );
  }
}
