import { OmitType } from '@nestjs/mapped-types';
import { FolderEntity } from '../entities/folder.entity';
import { IsString, IsNotEmpty, Length, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFolderDto extends OmitType(FolderEntity, ['id']) {
  @ApiProperty({
    description: 'This defines the name of a folder',
    example: 'About Notepott',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'This defines the description related to the folder',
    example: 'Notepott is inspired by notesnook',
  })
  @IsString()
  @Length(0, 200)
  @IsNotEmpty()
  description: string;
}
