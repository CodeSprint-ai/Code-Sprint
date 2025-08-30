import { SprintSession } from '../entities/SprintSession';

export class SprintDto {
  uuid: string;
  userId: string;
  problemIds: string[];
  startTime: Date;
  endTime: Date;
  status: string;

  static toDto(sprint: SprintSession): SprintDto {
    return {
      uuid: sprint.uuid,
      userId: sprint.user.uuid,
      problemIds: sprint.problemIds,
      startTime: sprint.startTime,
      endTime: sprint.endTime,
      status: sprint.status,
    };
  }
}
