import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { AccountVerificationEntity } from '../entities/account-verification.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ForgetPasswordUserDto {
  @ApiProperty({
    description: 'Enter email to get Otp',
    example: 'johndoe@gmail.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
