import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';

// @Controller('auth') => Thể hiện đường dẫn là auth/register
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // Register a user
  @Post('register')
  register(@Body() authDTO: AuthDTO) {
    // body là Data Transfer Object - DTO
    return this.authService.register(authDTO);
  }

  // Login a user
  @Post('login')
  login(@Body() authDTO: AuthDTO) {
    return this.authService.login(authDTO);
  }
}
