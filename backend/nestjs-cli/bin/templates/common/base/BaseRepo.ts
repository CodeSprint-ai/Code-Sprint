// src/common/base/base.repository.ts
import { Model, ClientSession, FilterQuery, UpdateQuery, Document, Mongoose, Types, HydratedDocument } from 'mongoose';

export class BaseRepository<T extends Document> {
    constructor(protected readonly model: Model<T>) { }

    async findAll(): Promise<T[]> {
        return this.model.find().exec();
    }

    async findById(id: Types.ObjectId | String): Promise<T | null> {
        return this.model.findById(id).exec();
    }

    async findOne(filter: FilterQuery<T>): Promise<T | null> {
        return this.model.findOne(filter).exec();
    }

    async create(data: Partial<T>, session?: ClientSession): Promise<T> {
        return new this.model(data).save({ session });
    }

    async update(id: Types.ObjectId | String, update: UpdateQuery<T>, session?: ClientSession): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, update, { new: true, session }).exec();
    }

    async delete(id: Types.ObjectId | String): Promise<T | null> {
        return this.model.findByIdAndDelete(id).exec();
    }

    async exists(filter: FilterQuery<T>): Promise<boolean> {
        return this.model.exists(filter).then((res) => !!res);
    }
}
