import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResendOtpDto {
  @ApiProperty({
    description: 'Enter email to get Otp',
    example: 'johndoe@gmail.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
