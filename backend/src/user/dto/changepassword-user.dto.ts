import { IsEmail, IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';
import { UserEntity } from '../entities/user.entity';
import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto extends OmitType(UserEntity, ['id']) {
  // @IsString()
  // @IsNotEmpty()
  // confirmPassword: string;
  @ApiProperty({
    description: 'Enter four digit Otp code',
    example: '4543'
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'Enter new minimum 8 digit password following the pattern shown in example',
    example: '12345678Aa@'
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/(?=.*[a-z])/, { message: 'Password must contain at least one lowercase letter' })
  @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/(?=.*\d)/, { message: 'Password must contain at least one number' })
  @Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, { message: 'Password must contain at least one special character' })
  password: string;

  @ApiProperty({
    description: 'Enter Valid Email',
    example: 'johndoe@gmail.com'
  })
  @IsEmail()
  email: string;
}
