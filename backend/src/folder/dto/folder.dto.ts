import { Exclude, Expose } from 'class-transformer';
import { OmitType } from '@nestjs/mapped-types';
import { FolderEntity } from '../entities/folder.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Exclude()
export class FolderDto extends FolderEntity {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

}
