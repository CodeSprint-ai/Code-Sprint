import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SprintSession } from './entities/SprintSession';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.model';
import { SprintCommand } from '../submission/command/SprintCommand';
import { SprintDto } from '../submission/dto/SprintDto';
import { SprintStatus } from '../submission/enum/SprintStatus';

@Injectable()
export class SprintService {
  constructor(
    @InjectRepository(SprintSession)
    private sprintRepo: Repository<SprintSession>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // async startSprint(cmd: SprintCommand): Promise<SprintDto> {
  //   const user = await this.userRepo.findOne({ where: { uuid: cmd.userId } });
  //   if (!user) throw new NotFoundException('User not found');
  //
  //   const now = new Date();
  //   const sprint = this.sprintRepo.create({
  //     user,
  //     startTime: now,
  //     endTime: new Date(now.getTime() + cmd.durationMinutes * 60000),
  //     status: SprintStatus.ACTIVE,
  //   });
  //
  //   await this.sprintRepo.save(sprint);
  //   return SprintDto.toDto(sprint);
  // }
  //
  // async endSprint(sprintId: string): Promise<SprintDto> {
  //   const sprint = await this.sprintRepo.findOne({
  //     where: { uuid: sprintId },
  //     relations: ['user'],
  //   });
  //   if (!sprint) throw new NotFoundException('Sprint not found');
  //   sprint.status = SprintStatus.COMPLETED;
  //   await this.sprintRepo.save(sprint);
  //   return SprintDto.toDto(sprint);
  // }
}

