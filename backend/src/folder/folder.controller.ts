import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  Version,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FolderEntity } from './entities/folder.entity';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { IdDto } from 'src/common/dto/id.dto';
import { User } from 'src/auth/decorator/user.decorator';
@ApiTags('Folder')
@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Version('1')
  @Post()
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse({
    description: 'Created Folder Object succesfully',
    type: FolderEntity,
  })
  @ApiBadRequestResponse({
    description: 'Folder cannot be created, try again',
  })
  create(@Body() createFolderDto: CreateFolderDto, @User() user : any) {
    return this.folderService.create(createFolderDto,user.id);
  }

  @Version('1')
  @Get()
  @ApiCreatedResponse({
    type: [FolderEntity],
  })
  @ApiBadRequestResponse({
    description: 'No folder records found',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Defines the maximum number of items to return.',
    example: 10,
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    description: 'Defines the maximum number of items to return.',
    example: 10,
    required: false,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Query() paginationDto: PaginationDto, @User() user :any) {
    return this.folderService.findAll(paginationDto,user.id);
  }

  @Version('1')
  @Get(':id')
  @ApiParam({
    name: 'id',
    description:
      'Here client will provide the id of the folder that needs to be searched.',
    example: '28769b0b-7e88-431a-8b23-fe7c36e8993a',
  })
  @ApiCreatedResponse({
    type: FolderEntity,
  })
  findOne(@Param('id', ParseUUIDPipe) id: string , @User() user:any) {
    return this.folderService.findOne(id,user.id);
  }

  @Version('1')
  @Patch(':id')
  @UsePipes(ValidationPipe)
  @ApiParam({
    name: 'id',
    description:
      'Here client will provide the id of the folder that needs to be updated.',
    example: '28769b0b-7e88-431a-8b23-fe7c36e8993a',
  })
  @ApiCreatedResponse({
    description: 'Updated Folder Object succesfully',
    type: FolderEntity,
  })
  @ApiBadRequestResponse({
    description: 'Folder cannot be created, try again',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFolderDto: UpdateFolderDto,
    @User() user:any
  ) {
    return this.folderService.update(id, updateFolderDto,user.id);
  }


  @Version('1')
  @Delete(':id')
  @ApiParam({
    name: 'id',
    description:
      'Here client will provide the id of the folder that needs to be updated.',
    example: '28769b0b-7e88-431a-8b23-fe7c36e8993a',
  })
  @ApiCreatedResponse({
    description: 'Folder has been succesfully deleted.',
    example: true,
  })
  delete(@Param('id', ParseUUIDPipe) id: string, @User() user : any) {
    return this.folderService.delete(id, user.id);
  }
  
}
