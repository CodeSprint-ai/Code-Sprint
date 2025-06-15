import { ApiProperty } from '@nestjs/swagger';
import { Folder } from '@prisma/client';

export class FolderEntity implements Folder {
  @ApiProperty({
    description: 'It defines each folder unique Id',
    example: '28769b0b-7e88-431a-8b23-fe7c36e8993a',
  })
  id: string;
  @ApiProperty({
    description: 'This defines the name of a folder',
    example: 'About Notepott',
  })
  name: string;
  @ApiProperty({
    description: 'This defines the description related to the folder',
    example: 'Notepott is inspired by notesnook',
  })
  description: string;
  @ApiProperty({
    description: 'This defines the date when folder was created',
  })
  createdAt: Date;
  @ApiProperty({
    description: 'This defines the date when folder was updated',
  })
  updatedAt: Date;
  
  userId: string;
}
