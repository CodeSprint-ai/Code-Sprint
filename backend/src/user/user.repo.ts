
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Document } from 'mongoose';
import { User, UserDocument } from './entities/user.model';
import { BaseRepository } from 'src/common/base/BaseRepo';


@Injectable()
export class UserRepository extends BaseRepository<UserDocument> {
    constructor(@InjectModel(User.name) userModel: Model<UserDocument>) {
        super(userModel);
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.model.findOne({ email }).exec();
    }

    // Add other custom user-specific methods here
}
