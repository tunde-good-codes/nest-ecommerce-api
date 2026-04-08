import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dtos/register.dto";
import { AuthResponseDto } from "./dtos/auth-response.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { RefreshTokenGuard } from "./guards/refresh-token.guards";
import { GetUser } from "src/common/decorators/get-user";
import { JwtAuthGuard } from "./guards/jwt-auth-guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //   Register api
  @Post("register")
  @HttpCode(201)
  @ApiOperation({
    summary: "Register a new user",
    description: "Creates a new user account"
  })
  @ApiResponse({
    status: 201,
    description: "User successfully registered",
    type: AuthResponseDto
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request. Validation failed or user already exists"
  })
  @ApiResponse({
    status: 500,
    description: "Internal Server Error"
  })
  @ApiResponse({
    status: 429,
    description: "Too Many Requests. Rate limit exceeded"
  })
  register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.registerUser(registerDto);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth("JWT-refresh")
  @ApiOperation({
    summary: "Refresh access token",
    description: "Generates a new access token using a valid refresh token"
  })
  @ApiResponse({
    status: 200,
    description: "New access token generated successfully",
    type: AuthResponseDto
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized. Invalid or expired refresh token"
  })
  @ApiResponse({
    status: 429,
    description: "Too Many Requests. Rate limit exceeded"
  })
  async refresh(@GetUser("id") userId: string): Promise<AuthResponseDto> {
    return await this.authService.refreshTokens(userId);
  }

  // Logout user and invalidate refresh token
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Logout user",
    description: "Logs out the user and invalidates the refresh token"
  })
  @ApiResponse({
    status: 200,
    description: "User successfully logged out"
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized. Invalid or expired access token"
  })
  @ApiResponse({
    status: 429,
    description: "Too Many Requests. Rate limit exceeded"
  })
  async logout(@GetUser("id") userId: string): Promise<{ message: string }> {
    await this.authService.logout(userId);
    return { message: "Successfully logged out" };
  }
}
