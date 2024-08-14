import {
  Body,
  Controller, Delete,
  Get,
  Inject,
  Param,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { WrapperResponseDtoMapper } from "@/lib/responses";

import { PermissionAction, PermissionCollection } from "@/core/domain/permissions";
import { CommandBus } from "@nestjs/cqrs";
import { CurrentUser, OwnerAccessRequired, RequiredPermissions, RequiredRoles } from "@/infrastructure/decorators";
import { JwtAuthGuard } from "@/infrastructure/auth/guards";
import { Deps } from "@/core/domain/shared/ioc";
import { SearchItemsParamsDto } from "@/infrastructure/http";
import { IUserRepository } from "@/core/domain/users";
import { Role, UserRole } from "@/core/domain/roles";
import {
  UserDtoMapper,
  UpdateUserAdditionalDataCommandResponseDto,
  UpdateUserCommandDto,
  WrapperResponseUpdateUserAdditionalDataCommandResponseDto,
  WrapperResponseUserDto,
  WrapperResponseUserListDto,
} from "@/infrastructure/features/users";
import { UpdateUserAdditionalDataCommand } from "@/core/application/features/users";
import { addConditionsToWhereClause } from "@/infrastructure/helpers";


@ApiTags("User")
@Controller("users")
export class UserController {
  private readonly dtoMapper = new UserDtoMapper();
  private readonly responseMapper = new WrapperResponseDtoMapper(this.dtoMapper);

  constructor(
    readonly commandBus: CommandBus,
    @Inject(Deps.UsersRepository)
    private readonly usersRepository: IUserRepository,
  ) {
  }


  @ApiResponse({
    type: WrapperResponseUserListDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Users, PermissionAction.Read])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @OwnerAccessRequired("createdBy")
  @Get()
  async readMany(
    @Query() params: SearchItemsParamsDto,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
  ) {
    if (!userRole.hasAdminAccess()) params._where = addConditionsToWhereClause([{
      _field: "createdBy",
      _l_op: "and",
      _val: userId,
    }], params._where);

    const result = await this.usersRepository.findByQuery(params);

  return this.responseMapper.mapFromQueryResult(result);

  }

  @ApiResponse({
    type: WrapperResponseUserDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Users, PermissionAction.Read])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @OwnerAccessRequired("createdBy")
  @Get(":id")
  async readOne(
    @Param("id") id: string,
  ) {
    const user = await this.usersRepository.findOne(id);

    return this.responseMapper.mapFrom(user);
  }


  @ApiResponse({
    type: WrapperResponseUserDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Users, PermissionAction.Read])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @OwnerAccessRequired("id")
  @Get("/data/me")
  async readCurrentUser(
    @CurrentUser("id") userId: string,
  ) {

    const user = await this.usersRepository.findOne(userId);
    return this.responseMapper.mapFrom(user);
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
    @Body() payload: UpdateUserCommandDto,
  ) {
    await this.usersRepository.updateOne(id, payload);

    const response = await this.usersRepository.findOne(id);

    return this.responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseUpdateUserAdditionalDataCommandResponseDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Users, PermissionAction.Update])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch("/data/additional")
  async updateUserAdditionalData(
    @CurrentUser("id") userId: string,
    @Body() payload: UpdateUserAdditionalDataCommandResponseDto,
  ) {

    const responseMapper = new WrapperResponseDtoMapper<UpdateUserAdditionalDataCommandResponseDto>();

    const command = new UpdateUserAdditionalDataCommand({
      ...payload,
      userId,
    });

    const response = await this.commandBus.execute(command);
    return responseMapper.mapFrom(response);
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
    @Param("id") id: string) {

    const user = await this.usersRepository.findOne(id);

    await this.usersRepository.deleteOne(id);

    return this.responseMapper.mapFrom(user);
  }
}

