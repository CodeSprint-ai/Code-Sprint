import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.model';
import { UserRepository } from './user.repo';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CommonModule
  ],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserService, MongooseModule,UserRepository]
})
export class UserModule { }
