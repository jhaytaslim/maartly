import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { memoryStore } from 'cache-manager';

// Modules
import { PrismaModule } from './prisma/prisma.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { StoresModule } from './stores/stores.module';
import { OrdersModule } from './orders/orders.module';
import { CustomersModule } from './customers/customers.module';
import { DebtsModule } from './debts/debts.module';
import { TaxesModule } from './taxes/taxes.module';
import { CurrencyModule } from './currency/currency.module';
import { PlansModule } from './plans/plans.module';
import { ReportsModule } from './reports/reports.module';
import { StorefrontModule } from './storefront/storefront.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OfflineSyncModule } from './offline-sync/offline-sync.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.RATE_LIMIT_TTL || '60'),
        limit: parseInt(process.env.RATE_LIMIT_MAX || '100'),
      },
    ]),

    // Task Scheduling
    ScheduleModule.forRoot(),

    // Caching with Redis
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        let store: any;

        try {
          // Attempt Redis connection
          store = await redisStore({
            socket: {
              host: process.env.REDIS_HOST || 'localhost',
              port: parseInt(process.env.REDIS_PORT || '6379'),
            },
            password: process.env.REDIS_PASSWORD || undefined,
            ttl: parseInt(process.env.CACHE_TTL || '3600'),
          });
          console.log('✅ Redis cache connected successfully');
        } catch (error) {
          console.warn(
            '⚠️ Redis connection failed, falling back to in-memory cache:',
            error instanceof Error ? error.message : String(error)
          );
          // Fallback to in-memory store
          store = await memoryStore({
            ttl: parseInt(process.env.CACHE_TTL || '3600'),
          });
        }

        return {
          store: store as any,
        };
      },
    }),

    // Application Modules
    PrismaModule,
    RabbitMQModule,
    EventsModule,
    AuthModule,
    UsersModule,
    TenantsModule,
    ProductsModule,
    CategoriesModule,
    SuppliersModule,
    StoresModule,
    OrdersModule,
    CustomersModule,
    DebtsModule,
    TaxesModule,
    CurrencyModule,
    PlansModule,
    ReportsModule,
    StorefrontModule,
    NotificationsModule,
    OfflineSyncModule,
  ],
})
export class AppModule {}
