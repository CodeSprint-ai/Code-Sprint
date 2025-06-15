import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { AccountVerificationEntity } from '../entities/account-verification.entity';
import { ApiProperty } from '@nestjs/swagger';

export class AccountVerificationUserDto extends AccountVerificationEntity {
  @ApiProperty({
    description: 'Otp code to Verify User',
    example: '3456',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
  @ApiProperty({
    description: 'Enter a valid email',
    example: 'Johndoe@gmail.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
