import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { AuthModule } from "./modules/auth/auth.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "./modules/users/users.module";
import { CategoryModule } from "./modules/category/category.module";
import { ProductsModule } from "./modules/products/products.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { ThrottlerModule } from "@nestjs/throttler";
import { PaymentsModule } from "./modules/payments/payments.module";
import { CartModule } from "./modules/cart/cart.module";
import { BullModule } from "@nestjs/bull";
import { RedisModule } from "@nestjs-modules/ioredis";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60, // seconds
        limit: 10 // 10 requests per 60 seconds
      }
    ]),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.getOrThrow("REDIS_HOST"),
          port: config.getOrThrow<number>("REDIS_PORT"),
          username: config.getOrThrow("REDIS_USERNAME"),
          password: config.getOrThrow("REDIS_PASSWORD")
        }
      })
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "single",
        options: {
          host: config.getOrThrow<string>("REDIS_HOST"),
          port: config.getOrThrow<number>("REDIS_PORT"),
          username: config.getOrThrow<string>("REDIS_USERNAME"),
          password: config.getOrThrow<string>("REDIS_PASSWORD")
        }
      })
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CategoryModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    CartModule
  ],
  providers: [AppService],
  exports: [AppService],
  controllers: [AppController]
})
export class AppModule {}
