import { IsJWT, IsStrongPassword } from 'class-validator';

export class AuthResetDTO {
  @IsStrongPassword({
    minLength: 6,
    minSymbols: 0,
  })
  password: string;

  @IsJWT()
  token: string;
}
