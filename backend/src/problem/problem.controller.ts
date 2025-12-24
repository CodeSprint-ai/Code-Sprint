import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProblemService } from './problem.service';
import { ProblemDto } from './dto/ProblemDto';
import { CreateProblemCommand } from './command/ProblemCommand';
import { UpdateProblemCommand } from './command/UpdateProblemCommand';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ResponseWrapper } from '../common/dtos/ResponseWrapper';
import { Roles } from 'src/common/decorators/roleDecorater';

@ApiTags('problems')
@Controller('problems')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'The problem has been successfully created.',
    type: ProblemDto,
  })
  async create(
    @Body() createProblemCommand: CreateProblemCommand,
    @Req() req: Request,
  ): Promise<ReturnType<typeof ResponseWrapper.success>> {
    const createdProblem =
      await this.problemService.create(createProblemCommand);
    return ResponseWrapper.success(
      createdProblem,
      'Problem created successfully',
    );
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all problems.',
    type: [ProblemDto],
  })
  
  async findAll(): Promise<ReturnType<typeof ResponseWrapper.success>> {
    const problems = await this.problemService.findAll();
    return ResponseWrapper.success(problems, 'Problems fetched successfully');
  }

  // @Get(':slug')
  // @ApiResponse({
  //   status: 200,
  //   description: 'Returns a single problem by slug.',
  //   type: ProblemDto,
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: 'Problem not found.',
  // })
  // async findOneBySlug(
  //   @Param('slug') slug: string,
  // ): Promise<ReturnType<typeof ResponseWrapper.success>> {
  //   const problem = await this.problemService.findOneBySlug(slug);
  //   return ResponseWrapper.success(problem, 'Problem fetched successfully');
  // }


  @Get(':uuid')
  @ApiResponse({
    status: 200,
    description: 'Returns a single problem by slug.',
    type: ProblemDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Problem not found.',
  })
  async findOneByUuid(
    @Param('uuid') uuid: string,
  ): Promise<ReturnType<typeof ResponseWrapper.success>> {
    const problem = await this.problemService.findOneByUuid(uuid);
    return ResponseWrapper.success(ProblemDto.toDto(problem), 'Problem fetched successfully');
  }



  @Post('/update')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The problem has been successfully updated.',
    type: ProblemDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Problem not found.',
  })
  async update(
    @Body() updateProblemCommand: UpdateProblemCommand,
  ): Promise<ReturnType<typeof ResponseWrapper.success>> {
    const updatedProblem =
      await this.problemService.update(updateProblemCommand);
    return ResponseWrapper.success(
      updatedProblem,
      'Problem updated successfully',
    );
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiResponse({
    status: 204,
    description: 'The problem has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Problem not found.',
  })
  async remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<ReturnType<typeof ResponseWrapper.success>> {
    await this.problemService.remove(uuid);
    return ResponseWrapper.success(null, 'Problem deleted successfully');
  }
}
