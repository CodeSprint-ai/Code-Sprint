import { Controller, Get, Global, Module, Req } from '@nestjs/common';
import { UsageService } from './usage.service';
@Controller('usage')
class UsageController {
  constructor(private readonly usage: UsageService) {}
  @Get('ai') get(@Req() req: { user: { uuid: string } }) {
    return this.usage.getUsage(req.user.uuid);
  }
}
@Global()
@Module({
  providers: [UsageService],
  exports: [UsageService],
  controllers: [UsageController],
})
export class UsageModule {}
