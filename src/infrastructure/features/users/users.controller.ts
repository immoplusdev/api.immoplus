import { createReadStream } from "fs";
import {
  Body,
  Controller, Delete,
  Get,
  Inject,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query, StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from "@nestjs/swagger";
import { WrapperResponseDtoMapper } from "@/lib/responses";

import { PermissionAction, PermissionCollection } from "@/core/domain/permissions";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { fileUploadConfig } from "@/infrastructure/configs";
import { generateUuid } from "@/lib/ts-utilities/db";
import { CommandBus } from "@nestjs/cqrs";
import { CurrentUser, RequiredPermissions, RequiredRoles } from "@/infrastructure/decorators";
import { JwtAuthGuard } from "src/infrastructure/auth/guards";
import { addConditionsToWhereClause, getFilePath } from "@/infrastructure/helpers";
import { Deps } from "@/core/domain/shared/ioc";
import {
  ensureResourceListOwnership,
  ensureResourceOwnership,
  filterRessourceByOwnership,
} from "@/infrastructure/auth/helpers";
import { SearchItemsParamsDto } from "@/infrastructure/http";
import { IUsersRepository, User } from "@/core/domain/users";
import {
  CreateUserCommandDto,
  CreateUserCommandResponseDto, UpdateUserCommandDto, UserDto,
  WrapperResponseUserDto, WrapperResponseUserListDto,
} from "@/infrastructure/features/users/dtos";
import { Role, UserRole } from "@/core/domain/roles";
import { UserDtoMapper } from "@/infrastructure/features/users/dtos/user-dto.mapper";


@ApiTags("User")
@Controller("users")
export class UsersController {
  constructor(
    readonly commandBus: CommandBus,
    @Inject(Deps.UsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {
  }

  // @ApiResponse({
  //   type: WrapperResponseUserDto,
  // })
  // @Post()
  // @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  // @RequiredPermissions([PermissionCollection.Users, PermissionAction.Create])
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // async create(
  //   @CurrentUser("id") userId: string,
  //   @Body() payload: CreateUserCommandDto,
  // ) {
  //
  //   const responseMapper = new WrapperResponseDtoMapper<CreateUserCommandResponseDto>();
  //
  //   const response = await this.usersRepository.create(payload);
  //
  //   return responseMapper.mapFrom(response);
  // }


  @ApiResponse({
    type: WrapperResponseUserListDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Users, PermissionAction.Read])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async readMany(
    @Query() params: SearchItemsParamsDto,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
  ) {

    const responseMapper = new WrapperResponseDtoMapper<UserDto[]>();

    params._where = addConditionsToWhereClause([{
      _field: "uploadedBy",
      _l_op: "and",
      _val: userId,
    }], params._where);

    const users = await this.usersRepository.find(params);
    const outputUsers = filterRessourceByOwnership<User>(users, userId, "id", userRole.id);
    return responseMapper.mapFrom(UserDtoMapper.mapListFrom(outputUsers));
  }

  @ApiResponse({
    type: WrapperResponseUserDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Users, PermissionAction.Read])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(":id")
  async readOne(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
  ) {

    const responseMapper = new WrapperResponseDtoMapper<UserDto>();

    const user = await this.usersRepository.findOne(id);

    ensureResourceOwnership(userId, user.id, userRole.id);

    return responseMapper.mapFrom(UserDtoMapper.mapFrom(user));
  }


  @ApiResponse({
    type: WrapperResponseUserDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Users, PermissionAction.Read])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("/data/me")
  async readCurrentUser(
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
  ) {
    const responseMapper = new WrapperResponseDtoMapper<UserDto>();

    const user = await this.usersRepository.findOne(userId);

    ensureResourceOwnership(userId, user.id, userRole.id);

    return responseMapper.mapFrom(UserDtoMapper.mapFrom(user));
  }


  @ApiResponse({
    type: WrapperResponseUserDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Users, PermissionAction.Update])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
    @Body() payload: UpdateUserCommandDto,
  ) {

    const responseMapper = new WrapperResponseDtoMapper<UserDto>();

    const user = await this.usersRepository.findOne(id);

    ensureResourceOwnership(userId, user.id, userRole.id);

    await this.usersRepository.update(id, payload);

    const response = await this.usersRepository.findOne(id);

    return responseMapper.mapFrom(UserDtoMapper.mapFrom(response));
  }

  @ApiResponse({
    type: WrapperResponseUserDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Users, PermissionAction.Delete])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(":id")
  async delete(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role) {

    const responseMapper = new WrapperResponseDtoMapper<UserDto>();

    const user = await this.usersRepository.findOne(id);

    ensureResourceOwnership(userId, user.id, userRole.id);

    await this.usersRepository.delete(id);

    return responseMapper.mapFrom(UserDtoMapper.mapFrom(user));
  }
}

