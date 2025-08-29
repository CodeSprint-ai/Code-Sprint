// @ts-ignore
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterCommand {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
