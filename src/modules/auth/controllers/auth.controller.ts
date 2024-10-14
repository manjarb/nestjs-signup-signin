import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from 'src/modules/interceptors/response/response.interceptor';

import { SignupResponse } from '../auth.interface';
import { SignupDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up a new user' })
  @UseInterceptors(ResponseInterceptor)
  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<SignupResponse> {
    const { name, email, password } = signupDto;
    return this.authService.signup(name, email, password);
  }
}
