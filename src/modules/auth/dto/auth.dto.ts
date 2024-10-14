import { IsString, IsEmail, Matches } from 'class-validator';
import {
  PASSWORD_ERROR_MESSAGE,
  PASSWORD_REGEX,
} from 'src/constant/password.constants';

export class SignupDto {
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @Matches(PASSWORD_REGEX, { message: PASSWORD_ERROR_MESSAGE })
  readonly password: string;
}
