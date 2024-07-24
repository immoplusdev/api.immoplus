import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { CreateUserDto } from '@/infrastructure/features/users/dtos/create-user.dto';
import { UpdateUserDto } from '@/infrastructure/features/users/dtos/update-user.dto';
import { IUsersRepository } from '@/core/domain/users';
import { Deps } from '@/core/domain/shared/ioc';
import { WrapperResponseDtoMapper } from '@/lib/responses';
import { UserDto } from '@/infrastructure/features/users/dtos/users.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  WrapperResponseUserDto,
  WrapperResponseUsersDto,
} from '@/infrastructure/features/users/dtos/wrapper-response-users.dto';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(
    @Inject(Deps.UsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {
  }

  @ApiResponse({
    type: WrapperResponseUsersDto,
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const mapper = new WrapperResponseDtoMapper<UserDto>();
    return mapper.mapFrom(await this.usersRepository.create(createUserDto));
  }

  @ApiResponse({
    type: WrapperResponseUsersDto,
  })
  @Get()
  async findAll() {
    const mapper = new WrapperResponseDtoMapper<UserDto[]>();
    return mapper.mapFrom(await this.usersRepository.findAll());
  }

  @ApiResponse({
    type: WrapperResponseUsersDto,
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const mapper = new WrapperResponseDtoMapper<UserDto>();
    return mapper.mapFrom(await this.usersRepository.findOne(id));
  }

  @ApiResponse({
    type: WrapperResponseUsersDto,
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const mapper = new WrapperResponseDtoMapper<UserDto>();
    await this.usersRepository.update(id, updateUserDto);
    return mapper.mapFrom(await this.usersRepository.findOne(id));
  }

  @ApiResponse({
    type: WrapperResponseUsersDto,
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const mapper = new WrapperResponseDtoMapper<UserDto>();
    await this.usersRepository.delete(id);
    return mapper.mapFrom(await this.usersRepository.findOne(id));
  }
}
