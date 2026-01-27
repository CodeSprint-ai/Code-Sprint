import { SavedProblem } from '../entities/SavedProblem';
import { DifficultyEnum } from '../../problem/enum/DifficultyEnum';

export class SavedProblemDto {
    uuid: string;
    problemUuid: string;
    problemTitle: string;
    problemSlug: string;
    difficulty: DifficultyEnum;
    notes?: string;
    savedAt: string;

    static fromEntity(entity: SavedProblem): SavedProblemDto {
        return {
            uuid: entity.uuid,
            problemUuid: entity.problem.uuid,
            problemTitle: entity.problem.title,
            problemSlug: entity.problem.slug,
            difficulty: entity.problem.difficulty,
            notes: entity.notes,
            savedAt: entity.savedAt.toISOString(),
        };
    }
}
