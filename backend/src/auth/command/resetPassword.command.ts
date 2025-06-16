import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
export class ResetPasswordCommand {
    @IsNotEmpty()
    token: string;

    @MinLength(6)
    newPassword: string;
}