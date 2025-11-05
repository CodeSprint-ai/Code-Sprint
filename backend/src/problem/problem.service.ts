import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Problem } from './entities/Problem';
import { CreateProblemCommand } from './command/ProblemCommand';
import { UpdateProblemCommand } from './command/UpdateProblemCommand';
import slugify from 'slugify';
import { User } from 'src/user/entities/user.model';
import { TestCase } from './entities/TestCase';
import { CreateTestCaseCommand } from './command/CreateTestCaseCommand';
import { ProblemDto } from './dto/ProblemDto';

@Injectable()
export class ProblemService {
  constructor(
    @InjectRepository(Problem)
    private problemRepository: Repository<Problem>,
    @InjectRepository(TestCase)
    private testCaseRepository: Repository<TestCase>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Creates a new problem with its associated test cases.
   * @param command The command containing problem data.
   * @returns The created Problem entity.
   */
  async create(command: CreateProblemCommand): Promise<ProblemDto> {
    const slug = this.generateUniqueSlug(command.title);
    const user = await this.userRepository.findOneBy({
      uuid: command.createdByUuid,
    });
    if (!user) {
      throw new NotFoundException(
        `User with UUID ${command.createdByUuid} not found.`,
      );
    }
    const problem = this.problemRepository.create({
      ...command,
      slug,
      createdBy: user,
      testCases: command.testCases.map((tc) =>
        this.testCaseRepository.create(tc),
      ),
    });
    const savedProblem: Problem = await this.problemRepository.save(problem);
    return ProblemDto.toDto(savedProblem);
  }

  /**
   * Retrieves all problems.
   * @returns An array of Problem DTOs.
   */
  async findAll(): Promise<ProblemDto[]> {
    const problems = await this.problemRepository.find({
      relations: ['createdBy', 'testCases'],
    });
    return problems.map((problem) => ProblemDto.toDto(problem));
  }

  /**
   * Finds a problem by its UUID.
   * @param uuid The UUID of the problem.
   * @returns The found Problem entity.
   * @throws {NotFoundException} if the problem is not found.
   */
  async findOneByUuid(uuid: string): Promise<Problem> {
    const problem = await this.problemRepository.findOne({
      where: { uuid },
      relations: ['createdBy', 'testCases'],
    });
    if (!problem) {
      throw new NotFoundException(`Problem with UUID ${uuid} not found.`);
    }
    return problem;
  }

  /**
   * Finds a problem by its slug.
   * @param slug The slug of the problem.
   * @returns The found Problem entity.
   * @throws {NotFoundException} if the problem is not found.
   */
  async findOneBySlug(slug: string): Promise<ProblemDto> {
    const problem = await this.problemRepository.findOne({
      where: { slug },
      relations: ['createdBy', 'testCases'],
    });
    if (!problem) {
      throw new NotFoundException(`Problem with slug ${slug} not found.`);
    }
    return ProblemDto.toDto(problem);
  }

  /**
   * Updates an existing problem.
   * @param command The command containing update data.
   * @returns The updated Problem entity.
   */
  async update(command: UpdateProblemCommand): Promise<ProblemDto> {
    const problem = await this.findOneByUuid(command.problemUuid);

    const updatedProblem = { ...problem, ...command };
    if (command.title && command.title !== problem.title) {
      updatedProblem.slug = this.generateUniqueSlug(command.title);
    }

    // Handle test case updates if provided
    if (command.testCases) {
      // Clear existing test cases and create new ones.
      // A more robust solution might handle individual updates/deletes, but
      // this simple approach is common for nested objects.
      await this.testCaseRepository.remove(problem.testCases);
      updatedProblem.testCases = command.testCases.map((tc) =>
        this.testCaseRepository.create(tc as CreateTestCaseCommand),
      );
    }

    const savedProblem = await this.problemRepository.save(updatedProblem);
    return ProblemDto.toDto(savedProblem);
  }

  /**
   * Deletes a problem by its UUID.
   * @param uuid The UUID of the problem to delete.
   */
  async remove(uuid: string): Promise<void> {
    const result = await this.problemRepository.delete(uuid);
    if (result.affected === 0) {
      throw new NotFoundException(`Problem with UUID ${uuid} not found.`);
    }
  }

  /**
   * Generates a unique slug from a title.
   * @param title The title of the problem.
   * @returns A unique slug string.
   */
  private generateUniqueSlug(title: string): string {
    return slugify(title, {
      lower: true,
      strict: true,
    });
  }
}
