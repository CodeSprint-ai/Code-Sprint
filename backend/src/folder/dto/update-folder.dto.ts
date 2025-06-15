import { PartialType } from '@nestjs/mapped-types';
import { CreateFolderDto } from './create-folder.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
// import { IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class UpdateFolderDto  {
  @ApiProperty({
    description: 'This defines the name of a folder',
    example: 'About Notepott',
    required: false,
  })
  @IsNotEmpty()
  name: string;
  @ApiProperty({
    description: 'This defines the description related to the folder',
    example: 'Notepott is inspired by notesnook',
    required: false,
  })
  description?: string;
}
