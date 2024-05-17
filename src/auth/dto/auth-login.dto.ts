import { IsEmail, IsStrongPassword } from 'class-validator';

export class AuthLoginDTO {
  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 6,
    minSymbols: 0,
  })
  password: string;
}
