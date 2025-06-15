import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { DEFAULT_PAGE_Limit } from 'src/common/utils/common.constants';
import { IdDto } from 'src/common/dto/id.dto';
import { FolderDto } from './dto/folder.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FolderService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createFolderDto: CreateFolderDto,
    userId: string,
  ): Promise<FolderDto> {
    const folder = {
      ...createFolderDto,
      userId,
    };

    const folderCreated = await this.prismaService.folder.create({
      data: folder,
    });

    const folderDto = plainToInstance(FolderDto, folderCreated);

    return folderDto;
  }

  async findAll(
    paginationDto: PaginationDto,
    userId: string,
  ): Promise<FolderDto[]> {
    console.log({ paginationDto });

    const folders = await this.prismaService.folder.findMany({
      where: {
        userId,
      },
      take: paginationDto.limit ?? DEFAULT_PAGE_Limit.limit,
      skip: paginationDto.offset ?? DEFAULT_PAGE_Limit.offset,
    });

    const foldersDto = plainToInstance(FolderDto, folders);

    return foldersDto;
  }

  async findOne(id: string, userId: string): Promise<FolderDto> {
    try {
      const folder = await this.prismaService.folder.findUnique({
        where: {
          id,
        },
      });

      if (folder.userId != userId) {
        throw new ForbiddenException(
          'You are not allowed to acces that folder',
        );
      }

      const folderDto = plainToInstance(FolderDto, folder);

      return folderDto;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateFolderDto: UpdateFolderDto,
    userId: any,
  ): Promise<FolderDto> {
    const updatedFolder = await this.prismaService.folder.update({
      where: {
        userId,
        id,
      },
      data: updateFolderDto,
    });

    const updatedFolderDto = plainToInstance(FolderDto, updatedFolder);

    return updatedFolderDto;
  }

  async delete(id: string, userId: any) {
    try {
      await this.prismaService.folder.delete({
        where: {
          userId,
          id,
        },
      });

      return true;
    } catch (error) {
      throw error;
    }
  }
}
