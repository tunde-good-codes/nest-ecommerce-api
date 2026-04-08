import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { AuthModule } from "./modules/auth/auth.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    }),
    PrismaModule,
    AuthModule
  ],
  providers: [AppService],
  exports: [AppService],
  controllers: [AppController]
})
export class AppModule {}
