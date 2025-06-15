import { OmitType, PartialType } from '@nestjs/mapped-types';
import { UserEntity } from '../entities/user.entity';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
// import { SignUpUserDto } from './signup-user.dto';

export class SignInUserDto  {
  // @ApiProperty({
  //   description: 'The id of the user',
  //   example: 'c23885d2-96ac-4764-b455-5d4aecdebf85',
  // }) 
  // id: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'johndoe@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Enter new minimum 8 digit password following the pattern shown in example',
    example: '12345678Aa@',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

}
