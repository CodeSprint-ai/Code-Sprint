// src/common/request-context.service.ts
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { User } from '../../user/entities/user.model';

type Store = {
  user: User;
};

@Injectable()
export class RequestContextService {
  private readonly storage = new AsyncLocalStorage<Store>();

  run(user: any, callback: () => void) {
    this.storage.run({ user }, callback);
  }

  getUser(): User | undefined {
    return this.storage.getStore()?.user;
  }
}
