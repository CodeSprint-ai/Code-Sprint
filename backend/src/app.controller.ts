import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/publicDecorator';

@Controller()
export class AppController {

  @Public()
  @Get()
  health() {
    return { status: 'ok', timestamp: new Date() };
  }
}
