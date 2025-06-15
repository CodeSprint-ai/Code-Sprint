import { Injectable } from '@nestjs/common';
import { AuthCreateDto } from './dto/auth.create.dto';
import { AuthUpdateDto } from './dto/auth.update.dto';
@Injectable()
export class AuthService {
  create(authCreateDto: AuthCreateDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, authUpdateDto: AuthUpdateDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
