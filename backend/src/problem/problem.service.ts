import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Problem } from './entities/Problem';
import { CreateProblemCommand } from './command/ProblemCommand';
import { BulkCreateProblemCommand } from './command/BulkCreateProblemCommand';
import { UpdateProblemCommand } from './command/UpdateProblemCommand';
import slugify from 'slugify';
import { User } from 'src/user/entities/user.model';
import { TestCase } from './entities/TestCase';
import { CreateTestCaseCommand } from './command/CreateTestCaseCommand';
import { ProblemDto } from './dto/ProblemDto';
import { AuthGuard } from '@nestjs/passport';



@Injectable()
export class ProblemService {
  constructor(
    @InjectRepository(Problem)
    private problemRepository: Repository<Problem>,
    @InjectRepository(TestCase)
    private testCaseRepository: Repository<TestCase>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

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
   * Creates multiple problems from a bulk command.
   * @param command The bulk command containing an array of problem creation commands.
   * @returns An array of created Problem DTOs.
   */
  async createBulk(
    command: BulkCreateProblemCommand,
  ): Promise<ProblemDto[]> {
    const createdProblems: ProblemDto[] = [];
    for (const problemCommand of command.problems) {
      // Reusing the single create logic to ensure consistency (slug generation, user check, etc.)
      // This is sequential, which is safer for slug generation if titles are same, though less performant than a bulk insert.
      // Given the complexity of nested relations (testCases) and slug logic, sequential is preferred for now.
      const createdProblem = await this.create(problemCommand);
      createdProblems.push(createdProblem);
    }
    return createdProblems;
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
   * Get paginated problems with filters
   * Supports filtering by difficulty, search (title or tags), date range, and tag
   */
  async getProblemsPaginated(
    query: {
      page?: number;
      pageSize?: number;
      difficulty?: string;
      search?: string;
      tag?: string;
      pattern?: string;
      fromDate?: string;
      toDate?: string;
    }
  ): Promise<{
    data: ProblemDto[];
    meta: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };
  }> {
    const {
      page = 1,
      pageSize = 10,
      difficulty,
      search,
      tag,
      pattern,
      fromDate,
      toDate,
    } = query;

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Build query builder
    const queryBuilder = this.problemRepository
      .createQueryBuilder('problem')
      .leftJoinAndSelect('problem.createdBy', 'createdBy')
      .leftJoinAndSelect('problem.testCases', 'testCases')
      .orderBy('problem.createdAt', 'DESC');

    // Apply difficulty filter
    if (difficulty) {
      queryBuilder.andWhere('problem.difficulty = :difficulty', { difficulty });
    }

    // Apply search filter (title or tags)
    if (search) {
      queryBuilder.andWhere(
        '(problem.title ILIKE :search OR problem.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Apply tag filter - check if any tag in the array contains the search term
    if (tag) {
      queryBuilder.andWhere('EXISTS (SELECT 1 FROM unnest(problem.tags) AS t WHERE t ILIKE :tag)', {
        tag: `%${tag}%`,
      });
    }

    // Apply pattern filter
    if (pattern) {
      queryBuilder.andWhere(':pattern::"public"."problems_patterns_enum" = ANY(problem.patterns)', { pattern });
    }

    // Apply date range filters
    if (fromDate) {
      queryBuilder.andWhere('problem.createdAt >= :fromDate', {
        fromDate: new Date(fromDate),
      });
    }
    if (toDate) {
      queryBuilder.andWhere('problem.createdAt <= :toDate', {
        toDate: new Date(toDate),
      });
    }

    // Get total count before pagination
    const total = await queryBuilder.getCount();

    // Apply pagination
    const problems = await queryBuilder.skip(skip).take(take).getMany();

    const totalPages = Math.ceil(total / pageSize);

    return {
      data: problems.map((problem) => ProblemDto.toDto(problem)),
      meta: {
        total,
        page,
        pageSize,
        totalPages,
      },
    };
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
