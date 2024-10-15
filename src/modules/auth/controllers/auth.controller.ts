import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from 'src/modules/interceptors/response/response.interceptor';

import { SigninResponse, SignupResponse } from '../auth.interface';
import { SigninDto, SignupDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '/v1',
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

  @ApiOperation({ summary: 'Sign in a user' })
  @UseInterceptors(ResponseInterceptor)
  @Post('signin')
  async signin(@Body() signinDto: SigninDto): Promise<SigninResponse> {
    const { email, password } = signinDto;
    return this.authService.signin(email, password);
  }
}
