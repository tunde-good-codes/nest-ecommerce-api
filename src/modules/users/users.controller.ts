import { Controller, Get, UseGuards, Req } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../common/guards/jwt-auth-guard";
import { RolesGuard } from "src/common/guards/roles.guards";
import { UserResponseDto } from "./dto/user-response-dto";
import type { RequestWithUser } from "src/common/interfaces/request-user-interface";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "@prisma/client";

@ApiTags("users")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //   Get current user profile
  @Get("me")
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({
    status: 200,
    description: "The current user profile",
    type: UserResponseDto
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getProfile(@Req() req: RequestWithUser): Promise<UserResponseDto> {
    return await this.usersService.findOne(req.user.id);
  }

  // Get all users (for admin purposes)
  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({
    status: 200,
    description: "List of all users",
    type: [UserResponseDto]
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async findAll(): Promise<UserResponseDto[]> {
    return await this.usersService.findAll();
  }
}
