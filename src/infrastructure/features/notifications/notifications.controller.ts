import { Body, Controller, Delete, Get, Post, Query, Param, Inject, UseGuards, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiResponse } from "@nestjs/swagger";
import { Deps } from "@/core/domain/shared/ioc";
import { INotificationRepository } from "@/core/domain/notifications";
import {
  NotificationDto,
  WrapperResponseNotificationDto,
  WrapperResponseNotificationListDto,
} from "@/infrastructure/features/notifications";
import { CurrentUser, RequiredPermissions, RequiredRoles } from "@/infrastructure/decorators";
import { Role, UserRole } from "@/core/domain/roles";
import { PermissionAction, PermissionCollection } from "@/core/domain/permissions";
import { JwtAuthGuard } from "@/infrastructure/auth";
import { WrapperResponseDtoMapper } from "@/lib/responses";
import { SearchItemsParamsDto } from "@/infrastructure/http";
import { addConditionsToWhereClause } from "@/infrastructure/helpers";
import { ensureResourceOwnership } from "@/infrastructure/auth/helpers";


@ApiTags("Notification")
@Controller("notifications")
export class NotificationController {
  constructor(
    @Inject(Deps.NotificationRepository)
    private readonly repository: INotificationRepository,
  ) {}


  @ApiResponse({
    type: WrapperResponseNotificationDto,
  })
  @Post()
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Notifications, PermissionAction.Create])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(
    @Body() payload: NotificationDto,
    @CurrentUser() userId: string,
  ) {

    const responseMapper = new WrapperResponseDtoMapper<NotificationDto>();

    const response = await this.repository.create({ ...payload, createdBy: userId });

    return responseMapper.mapFrom(response);
  }


  @ApiResponse({
    type: WrapperResponseNotificationListDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Notifications, PermissionAction.Read])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async readMany(
    @Query() params: SearchItemsParamsDto,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
  ) {

    const responseMapper = new WrapperResponseDtoMapper<NotificationDto[]>();

    if (!userRole.hasAdminAccess()) params._where = addConditionsToWhereClause([{
      _field: "createdBy",
      _l_op: "and",
      _val: userId,
    }], params._where);

    const items = await this.repository.find(params);

    return responseMapper.mapFrom(items);
  }

  @ApiResponse({
    type: WrapperResponseNotificationDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Notifications, PermissionAction.Read])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(":id")
  async readOne(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
    @Query("fields") fields?: string[],
  ) {

    const responseMapper = new WrapperResponseDtoMapper<NotificationDto>();

    const item = await this.repository.findOne(id, fields);

    ensureResourceOwnership(userId, item.createdBy, userRole.id);

    return responseMapper.mapFrom(item);
  }


  @ApiResponse({
    type: WrapperResponseNotificationDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Notifications, PermissionAction.Update])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
    @Body() payload: NotificationDto,
  ) {
    const responseMapper = new WrapperResponseDtoMapper<NotificationDto>();

    const item = await this.repository.findOne(id);

    ensureResourceOwnership(userId, item.createdBy, userRole.id);

    await this.repository.update(userId, payload);

    return responseMapper.mapFrom(await this.repository.findOne(id));
  }

  @ApiResponse({
    type: WrapperResponseNotificationDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Notifications, PermissionAction.Delete])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(":id")
  async delete(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role) {

    const responseMapper = new WrapperResponseDtoMapper<NotificationDto>();

    const item = await this.repository.findOne(id);

    ensureResourceOwnership(userId, item.createdBy, userRole.id);

    return responseMapper.mapFrom(item);
  }
}
