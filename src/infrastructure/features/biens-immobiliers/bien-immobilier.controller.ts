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
  Put,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiResponse } from "@nestjs/swagger";
import { Deps } from "@/core/domain/common/ioc";
import { IBienImmobilierRepository } from "@/core/domain/biens-immobiliers";
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
  GeolocalizedItemsSearchParamsQueryDto,
  SearchItemsParamsDto,
  SelectItemsParamsDto,
} from "@/infrastructure/http";
import { addConditionsToWhereClause } from "@/infrastructure/helpers";
import { ItemNotFoundException } from "@/core/domain/common/exceptions";
import {
  WrapperResponseBienImmobilierBatchDto,
  WrapperResponseBienImmobilierDto,
} from "@/core/application/biens-immobiliers/bien-immobilier.dto";
import {
  CreateBienImmobilierDto,
  CreateBienImmobilierDtoMapper,
  UpdateBienImmobilierDto,
  UpdateBienImmobilierDtoMapper,
} from "@/core/application/biens-immobiliers";
import { BienImmobilierDtoMapper } from "@/core/application/biens-immobiliers/bien-immobilier-dto.mapper";
import { JwtAuthGuard } from "@/infrastructure/features/auth";
import { EventBus } from "@nestjs/cqrs";
import { BienImmobilierStatusValidationUpdatedEvent } from "@/core/application/demandes-visites";
import { BienImmobilierGeolocalisizeDto } from "@/infrastructure/http/dto/bien-immobilier-geolocalisize.dto";
import { BienImmobilierGeolocalisizeFilterDto } from "@/infrastructure/http/dto/bien-immobilier-geolocalisize-filter.dto";
import { IUserRepository } from "@/core/domain/users";
import { INotificationService } from "@/core/domain/notifications";
import { IGlobalizationService } from "@/core/domain/globalization";

@ApiTags("BienImmobilier")
@Controller("biens-immobiliers")
export class BienImmobilierController {
  private readonly dtoMapper = new BienImmobilierDtoMapper();
  private readonly responseMapper = new WrapperResponseDtoMapper(
    this.dtoMapper,
  );

  constructor(
    @Inject(Deps.BiensImmobiliesRepository)
    private readonly repository: IBienImmobilierRepository,
    private readonly eventBus: EventBus,
    @Inject(Deps.UsersRepository)
    private readonly usersRepository: IUserRepository,
    @Inject(Deps.NotificationService)
    private readonly notificationService: INotificationService,
    @Inject(Deps.GlobalizationService)
    private readonly globalizationService: IGlobalizationService,
  ) {}

  @ApiResponse({
    type: WrapperResponseBienImmobilierDto,
  })
  @Post()
  @RequiredRoles(
    UserRole.Admin,
    UserRole.Customer,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([
    PermissionCollection.BiensImmobilies,
    PermissionAction.Create,
  ])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(
    @Body() payload: CreateBienImmobilierDto,
    @CurrentUser("id") userId: string,
  ) {
    const payloadMapper = new CreateBienImmobilierDtoMapper();

    const response = await this.repository.createOne({
      ...payloadMapper.mapTo(payload),
      createdBy: userId,
      proprietaire: payload.proprietaire ? payload.proprietaire : userId,
    });

    // Notify all admin users about the new bien immobilier
    await this.notifyAdminsNewBienImmobilier(response.id);

    return this.responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseBienImmobilierBatchDto,
  })
  @RequiredRoles(
    UserRole.Admin,
    UserRole.Customer,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([
    PermissionCollection.BiensImmobilies,
    PermissionAction.Read,
  ])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
            _field: "proprietaire",
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
    type: WrapperResponseBienImmobilierDto,
  })
  @RequiredRoles(
    UserRole.Admin,
    UserRole.Customer,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([
    PermissionCollection.BiensImmobilies,
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

    if (!item) throw new ItemNotFoundException();

    return this.responseMapper.mapFrom(item);
  }

  @ApiResponse({
    type: WrapperResponseBienImmobilierBatchDto,
  })
  @Get("/data/public/")
  async readManyPublic(@Query() params: SearchItemsParamsDto) {
    const items = await this.repository.findByQuery(params);

    return this.responseMapper.mapFromQueryResult(items);
  }

  @ApiResponse({
    type: WrapperResponseBienImmobilierBatchDto,
  })
  @Get("/data/public/geolocalized")
  async readManyPublicGeolocalized(
    @Query() params: BienImmobilierGeolocalisizeDto,
  ) {
    const items = await this.repository.findByGeolocation(params);
    return this.responseMapper.mapFromQueryResult(items);
  }

  @ApiResponse({
    type: WrapperResponseBienImmobilierBatchDto,
  })
  @Get("data/filter/public")
  async readManyPublicGeolocalizedFilter(
    @Query() params: BienImmobilierGeolocalisizeFilterDto,
  ) {
    const items = await this.repository.findByGeolocationFilter(params);
    return this.responseMapper.mapFromQueryResult(items);
  }

  @ApiResponse({
    type: WrapperResponseBienImmobilierDto,
  })
  @Get("/data/public/:id")
  async readOnePublic(
    @Param("id") id: string,
    @Query() params?: SelectItemsParamsDto,
  ) {
    const item = await this.repository.findOne(id, { fields: params?._select });

    if (!item) throw new ItemNotFoundException();

    return this.responseMapper.mapFrom(item);
  }

  @ApiResponse({
    type: WrapperResponseBienImmobilierDto,
  })
  @RequiredRoles(
    UserRole.Admin,
    UserRole.Customer,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([
    PermissionCollection.BiensImmobilies,
    PermissionAction.Update,
  ])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
    @Body() payload: UpdateBienImmobilierDto,
  ) {
    const payloadMapper = new UpdateBienImmobilierDtoMapper();

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

    await this.repository.updateByQuery(query, {
      ...payloadMapper.mapTo(payload),
      createdBy: userId,
    });

    if (payload.statusValidation && userRole.hasAdminAccess())
      await this.eventBus.publish(
        new BienImmobilierStatusValidationUpdatedEvent({
          id,
          status: payload.statusValidation,
        }),
      );

    return this.responseMapper.mapFrom(
      (await this.repository.findByQuery(query)).data.at(0),
    );
  }

  @ApiResponse({
    type: WrapperResponseBienImmobilierDto,
  })
  @RequiredRoles(
    UserRole.Admin,
    UserRole.Customer,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([
    PermissionCollection.BiensImmobilies,
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

    return this.responseMapper.mapFrom({ id } as never);
  }

  @ApiResponse({
    type: WrapperResponseBienImmobilierBatchDto,
  })
  @Put("data/update/coordonates")
  async updateAllCordonates() {
    return this.repository.updateAllCordonates();
  }

  private async notifyAdminsNewBienImmobilier(
    bienImmobilierId: string,
  ): Promise<void> {
    try {
      const adminUsers = await this.usersRepository.findAdminUsers();

      const subject = this.globalizationService.t(
        "all.notifications.reservations.nouveau_bien_immobilier_admin.subject",
      );
      const message = this.globalizationService.t(
        "all.notifications.reservations.nouveau_bien_immobilier_admin.message",
      );

      for (const admin of adminUsers) {
        await this.notificationService.sendNotification({
          userId: admin.id,
          subject,
          message,
          skipInAppNotification: false,
          sendMail: true,
          sendSms: false,
          returnUrl: `/admin/biens-immobiliers/${bienImmobilierId}`,
        });
      }
    } catch (error) {
      console.error("Error notifying admins about new bien immobilier:", error);
      // Don't throw error to prevent blocking bien immobilier creation
    }
  }
}
