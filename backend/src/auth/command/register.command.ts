import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterCommand {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    name: string;

    @MinLength(6)
    password: string;
}
