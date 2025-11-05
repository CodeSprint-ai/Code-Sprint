// src/common/base/base.repository.ts
import {
  Repository,
  DeepPartial,
  FindOptionsWhere,
  ObjectLiteral,
} from 'typeorm';

import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class BaseRepository<T extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<T>) {}

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findByUuid(uuid: string | number): Promise<T | null> {
    return this.repository.findOne({
      where: { uuid } as unknown as FindOptionsWhere<T>,
    });
  }

  async findOne(where: FindOptionsWhere<T>): Promise<T | null> {
    return this.repository.findOne({ where });
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(
    uuid: string | number,
    update: QueryDeepPartialEntity<T>,
  ): Promise<T | null> {
    await this.repository.update(uuid, update);
    return this.findByUuid(uuid);
  }

  async delete(uuid: string | number): Promise<boolean> {
    const result = await this.repository.delete(uuid);
    return result.affected !== 0;
  }

  async exists(where: FindOptionsWhere<T>): Promise<boolean> {
    const count = await this.repository.count({ where });
    return count > 0;
  }
}
