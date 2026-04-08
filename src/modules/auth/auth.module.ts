import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>("JWT_SECRET") ?? "defaultsecret2025",
        signOptions: {
          expiresIn: Number(configService.getOrThrow<number>("JWT_EXPIRES_IN", 900))
        }
      })
    })
  ]
})
export class AuthModule {}
