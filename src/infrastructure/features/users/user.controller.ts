import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { WrapperResponseDtoMapper } from "@/lib/responses";

import {
  PermissionAction,
  PermissionCollection,
} from "@/core/domain/permissions";
import { CommandBus } from "@nestjs/cqrs";
import {
  CurrentUser,
  OwnerAccessRequired,
  RequiredPermissions,
  RequiredRoles,
} from "@/infrastructure/decorators";
import { Deps } from "@/core/domain/common/ioc";
import { SearchItemsParamsDto } from "@/infrastructure/http";
import { IUserRepository } from "@/core/domain/users";
import { Role, UserRole } from "@/core/domain/roles";
import {
  UpdateUserAdditionalDataCommand,
  UpdateUserAdditionalDataCommandResponse,
  UpdateUserCommand,
  UserDtoMapper,
  WrapperResponseUpdateUserAdditionalDataCommandResponseDto,
  WrapperResponseUserDto,
  WrapperResponseUserListDto,
} from "@/core/application/users";
import { addConditionsToWhereClause } from "@/infrastructure/helpers";
import { AccessForbiddenException } from "@/core/domain/auth";
import { JwtAuthGuard } from "@/infrastructure/features/auth";
import { UserOtpService } from "./user-otp.service";
import {
  SendOtpDto,
  SendOtpResponseDto,
  VerifyOtpDto,
  VerifyOtpResponseDto,
} from "./dto";

@ApiTags("User")
@Controller("users")
export class UserController {
  private readonly dtoMapper = new UserDtoMapper();
  private readonly responseMapper = new WrapperResponseDtoMapper(
    this.dtoMapper,
  );

  constructor(
    readonly commandBus: CommandBus,
    @Inject(Deps.UsersRepository)
    private readonly usersRepository: IUserRepository,
    private readonly userOtpService: UserOtpService,
  ) {}

  @ApiResponse({
    type: WrapperResponseUserListDto,
  })
  @RequiredRoles(
    UserRole.Admin,
    UserRole.Customer,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
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
    if (!userRole.hasAdminAccess())
      params._where = addConditionsToWhereClause(
        [
          {
            _field: "createdBy",
            _l_op: "and",
            _val: userId,
          },
        ],
        params._where,
      );

    const result = await this.usersRepository.findByQuery(params);

    return this.responseMapper.mapFromQueryResult(result);
  }

  @ApiResponse({
    type: WrapperResponseUserDto,
  })
  @RequiredRoles(
    UserRole.Admin,
    UserRole.Customer,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([PermissionCollection.Users, PermissionAction.Read])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @OwnerAccessRequired("createdBy")
  @Get(":id")
  async readOne(@Param("id") id: string) {
    const user = await this.usersRepository.findOne(id);
    return this.responseMapper.mapFrom(user);
  }

  @ApiResponse({
    type: WrapperResponseUserDto,
  })
  @RequiredRoles(
    UserRole.Admin,
    UserRole.Customer,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([PermissionCollection.Users, PermissionAction.Read])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @OwnerAccessRequired("id")
  @Get("/data/me")
  async readCurrentUser(@CurrentUser("id") userId: string) {
    const user = await this.usersRepository.findOne(userId);
    return this.responseMapper.mapFrom(user);
  }

  @ApiResponse({
    type: WrapperResponseUserDto,
  })
  @RequiredRoles(
    UserRole.Admin,
    UserRole.Customer,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([PermissionCollection.Users, PermissionAction.Update])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(":id")
  async update(@Param("id") id: string, @Body() payload: UpdateUserCommand) {
    await this.usersRepository.updateOne(id, payload);

    const response = await this.usersRepository.findOne(id);

    return this.responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseUpdateUserAdditionalDataCommandResponseDto,
  })
  @RequiredRoles(
    UserRole.Admin,
    UserRole.Customer,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([PermissionCollection.Users, PermissionAction.Update])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch("/action/additional-data/:user")
  async updateUserAdditionalData(
    @Param("user") userId: string,
    @CurrentUser("id") currentUserId: string,
    @CurrentUser("role") userRole: Role,
    @Body() payload: UpdateUserAdditionalDataCommand,
  ) {
    if (!userRole.hasAdminAccess() && userId !== currentUserId)
      throw new AccessForbiddenException();

    const responseMapper =
      new WrapperResponseDtoMapper<UpdateUserAdditionalDataCommandResponse>();

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
  @RequiredRoles(
    UserRole.Admin,
    UserRole.Customer,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([PermissionCollection.Users, PermissionAction.Delete])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(":id")
  async delete(@Param("id") id: string) {
    const user = await this.usersRepository.findOne(id);

    await this.usersRepository.deleteOne(id);

    return this.responseMapper.mapFrom(user);
  }

  @ApiResponse({
    type: SendOtpResponseDto,
  })
  @Post("send-otp")
  async sendOtp(@Body() payload: SendOtpDto): Promise<SendOtpResponseDto> {
    const message = await this.userOtpService.sendOtp(payload.email);
    return { data: { message } };
  }

  @ApiResponse({
    type: VerifyOtpResponseDto,
  })
  @Post("verify-otp")
  async verifyOtp(
    @Body() payload: VerifyOtpDto,
  ): Promise<VerifyOtpResponseDto> {
    const result = await this.userOtpService.verifyOtp(payload.email, payload.otp);
    return { data: result };
  }
}
