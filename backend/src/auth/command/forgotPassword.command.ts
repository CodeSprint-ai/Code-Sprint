import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ForgotPasswordCommand {
  @IsEmail()
  email: string;
}