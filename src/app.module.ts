import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { AuthModule } from "./modules/auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./modules/users/users.module";
import { CategoryModule } from "./modules/category/category.module";
import { ProductsModule } from "./modules/products/products.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { ThrottlerModule } from "@nestjs/throttler";
import { PaymentsModule } from './modules/payments/payments.module';
import { CartModule } from './modules/cart/cart.module';

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
