import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Param,
  Inject,
  UseGuards,
  Patch,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiResponse } from "@nestjs/swagger";
import { Deps } from "@/core/domain/common/ioc";
import {
  INotificationRepository,
  SendNotificationParams,
} from "@/core/domain/notifications";
import {
  CreateNotificationDto,
  NotificationDto,
  NotificationDtoMapper,
  UpdateNotificationDto,
  WrapperResponseNotificationDto,
  WrapperResponseNotificationListDto,
} from "@/infrastructure/features/notifications";
import {
  CurrentUser,
  OwnerAccessRequired,
  RequiredPermissions,
  RequiredRoles,
} from "@/infrastructure/decorators";
import { Role, UserRole } from "@/core/domain/roles";
import {
  PermissionAction,
  PermissionCollection,
} from "@/core/domain/permissions";
import { WrapperResponseDtoMapper } from "@/lib/responses";
import {
  SearchItemsParamsDto,
  SelectItemsParamsDto,
} from "@/infrastructure/http";
import { addConditionsToWhereClause } from "@/infrastructure/helpers";
import { JwtAuthGuard } from "@/infrastructure/features/auth";
import { SendTestNotificationDto } from "./dto/send-test-notification.dto";

@ApiTags("Notification")
@Controller("notifications")
export class NotificationController {
  private readonly dtoMapper = new NotificationDtoMapper();
  private readonly responseMapper = new WrapperResponseDtoMapper(
    this.dtoMapper,
  );

  constructor(
    @Inject(Deps.NotificationRepository)
    private readonly repository: INotificationRepository,
  ) {}

  @ApiResponse({
    type: WrapperResponseNotificationDto,
  })
  @Post()
  @RequiredRoles(
    UserRole.Admin,
    UserRole.Customer,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([
    PermissionCollection.Notifications,
    PermissionAction.Create,
  ])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(
    @Body() payload: CreateNotificationDto,
    @CurrentUser("id") userId: string,
  ) {
    const response = await this.repository.createOne({
      ...payload,
      createdBy: userId,
    });

    return this.responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseNotificationListDto,
  })
  @RequiredRoles(
    UserRole.Admin,
    UserRole.Customer,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([
    PermissionCollection.Notifications,
    PermissionAction.Read,
  ])
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

    const items = await this.repository.findByQuery(params);

    return this.responseMapper.mapFromQueryResult(items);
  }

  @ApiResponse({
    type: WrapperResponseNotificationDto,
  })
  @RequiredRoles(
    UserRole.Admin,
    UserRole.Customer,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([
    PermissionCollection.Notifications,
    PermissionAction.Read,
  ])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @OwnerAccessRequired("createdBy")
  @Get(":id")
  async readOne(
    @Param("id") id: string,
    @Query() params?: SelectItemsParamsDto,
  ) {
    const item = await this.repository.findOne(id, { fields: params?._select });

    return this.responseMapper.mapFrom(item);
  }

  @ApiResponse({
    type: WrapperResponseNotificationDto,
  })
  @RequiredRoles(
    UserRole.Admin,
    UserRole.Customer,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([
    PermissionCollection.Notifications,
    PermissionAction.Update,
  ])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
    @Body() payload: UpdateNotificationDto,
  ) {
    const query = {
      _where: [
        {
          _field: "id",
          _val: id,
        },
      ],
    };

    if (!userRole.hasAdminAccess())
      query._where.push({ _field: "createdBy", _val: userId });

    await this.repository.updateByQuery(query, payload);

    return this.responseMapper.mapFrom(
      (await this.repository.findByQuery(query)).data.at(0),
    );
  }

  @ApiResponse({
    type: WrapperResponseNotificationDto,
  })
  @RequiredRoles(
    UserRole.Admin,
    UserRole.Customer,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([
    PermissionCollection.Notifications,
    PermissionAction.Delete,
  ])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(":id")
  async delete(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
  ) {
    const query = {
      _where: [
        {
          _field: "id",
          _val: id,
        },
      ],
    };

    if (!userRole.hasAdminAccess())
      query._where.push({ _field: "createdBy", _val: userId });

    await this.repository.deleteByQuery(query);

    return this.responseMapper.mapFrom({ id });
  }

  @RequiredRoles(
    UserRole.Admin,
    UserRole.Customer,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("send-test-notification")
  async sendTestNotification(
    @Body() payload: SendTestNotificationDto,
    @CurrentUser("id") userId: string,
  ) {
    console.log("Sending test notification with payload:", payload);
    const emailContent = `
        Objet : Test de notification !

        Bonjour,

        Nous vous remercions de votre confiance et de votre soutien.
        
        Nous sommes ravis de vous informer que nous avons bien reçu votre demande de test de notification.
        Nous avons effectué les vérifications nécessaires et nous sommes heureux de vous confirmer que tout fonctionne correctement.
        
        Cordialement,  
        L'équipe de support technique
      `;

    const params = new SendNotificationParams({
      userId: userId || userId,
      subject: payload.subject,
      message: payload.message,
      skipInAppNotification: payload.skipInAppNotification,
      sendMail: payload.sendMail,
      sendSms: payload.sendSms,
      htmlMessage: payload.htmlMessage || emailContent,
      returnUrl: payload.returnUrl || "localhost:3000/estate_detail/12",
    });

    console.log("Sending test notification with params:", params);

    const result = await this.repository.sendTestNotification(params);

    return result;
  }
}
