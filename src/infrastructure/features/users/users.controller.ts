import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from "@nestjs/common";
import { CreateUserDto } from "@/infrastructure/features/users/dtos/create-user.dto";
import { UpdateUserDto } from "@/infrastructure/features/users/dtos/update-user.dto";
import { IUsersRepository } from "@/core/domain/users";
import { Deps } from "@/core/domain/shared/ioc";
import { WrapperResponseDtoMapper } from "@/lib/responses";
import {
  UserDto, WrapperResponseUserDto,
  WrapperResponseUserListDto,
} from "@/infrastructure/features/users/dtos/users.dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";


@ApiTags("User")
@Controller("users")
export class UsersController {
  constructor(
    @Inject(Deps.UsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {
  }

  @ApiResponse({
    type: WrapperResponseUserDto,
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const mapper = new WrapperResponseDtoMapper<UserDto>();
    return mapper.mapFrom(await this.usersRepository.create(createUserDto));
  }

  @ApiResponse({
    type: WrapperResponseUserListDto,
  })
  @Get()
  async readMany() {
    const responseMapper = new WrapperResponseDtoMapper<UserDto[]>();
    return responseMapper.mapFrom(await this.usersRepository.find());
  }

  @ApiResponse({
    type: WrapperResponseUserDto,
  })
  @Get(":id")
  async readOne(@Param("id") id: string) {
    const responseMapper = new WrapperResponseDtoMapper<UserDto>();
    return responseMapper.mapFrom(await this.usersRepository.findOne(id));
  }

  @ApiResponse({
    type: WrapperResponseUserDto,
  })
  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    const responseMapper = new WrapperResponseDtoMapper<UserDto>();
    await this.usersRepository.update(id, updateUserDto);
    return responseMapper.mapFrom(await this.usersRepository.findOne(id));
  }

  @ApiResponse({
    type: WrapperResponseUserDto,
  })
  @Delete(":id")
  async delete(@Param("id") id: string) {
    const responseMapper = new WrapperResponseDtoMapper<UserDto>();
    await this.usersRepository.delete(id);
    return responseMapper.mapFrom(await this.usersRepository.findOne(id));
  }
}
