import { Body, Controller } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dtos/register.dto";
import { AuthResponseDto } from "./dtos/auth-response.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.registerUser(registerDto);
  }
}
