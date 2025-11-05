import { SprintSession } from '../entities/SprintSession';

export class SprintDto {
  uuid: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  status: string;

  static toDto(sprint: SprintSession): SprintDto {
    return {
      uuid: sprint.uuid,
      userId: sprint.user.uuid,
      startTime: sprint.startTime,
      endTime: sprint.endTime,
      status: sprint.status,
    };
  }
}
