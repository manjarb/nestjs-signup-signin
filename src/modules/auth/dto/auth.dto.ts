import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Matches } from 'class-validator';
import {
  PASSWORD_ERROR_MESSAGE,
  PASSWORD_REGEX,
} from 'src/constant/password.constants';

export class SignupDto {
  @ApiProperty({ description: 'The name of the user', example: 'John Doe' })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'johndoe@example.com',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'Password@123',
  })
  @IsString()
  @Matches(PASSWORD_REGEX, { message: PASSWORD_ERROR_MESSAGE })
  readonly password: string;
}

export class SigninDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'johndoe@example.com',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'Password@123',
  })
  @IsString()
  readonly password: string;
}
