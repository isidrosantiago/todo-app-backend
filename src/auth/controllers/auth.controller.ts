import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserCredentialsDto } from '../dto/user-credentials.dto';
import { AuthResponse } from '../types/auth-response.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(
    @Body() userCredentialsDto: UserCredentialsDto,
  ): Promise<AuthResponse> {
    return await this.authService.signUp(userCredentialsDto);
  }

  @Post('sign-in')
  async signIn(
    @Body() createUserDto: UserCredentialsDto,
  ): Promise<AuthResponse> {
    return await this.authService.signIn(createUserDto);
  }
}
