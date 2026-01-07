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
  UsePipes,
  ValidationPipe,
  Put,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiResponse } from "@nestjs/swagger";
import { Deps } from "@/core/domain/common/ioc";
import { IResidenceRepository } from "@/core/domain/residences";
import {
  CreateResidenceDto,
  ResidenceDtoMapper,
  WrapperResponseResidenceDto,
  WrapperResponseResidenceBatchDto,
} from "@/infrastructure/features/residences";
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
import { UpdateResidenceByIdCommand } from "@/core/application/residences";
import { CommandBus } from "@nestjs/cqrs";
import { JwtAuthGuard } from "@/infrastructure/features/auth";
import { GeolocalizedItemsSearchFiltersParamsQueryDto } from "@/infrastructure/http/dto/residence-geolocalized-filters-params-query.dto";
import { IUserRepository } from "@/core/domain/users";
import { INotificationService, PushNotificationType } from "@/core/domain/notifications";
import { IGlobalizationService } from "@/core/domain/globalization";

@ApiTags("Residence")
@Controller("residences")
export class ResidenceController {
  private readonly dtoMapper = new ResidenceDtoMapper();
  private readonly responseMapper = new WrapperResponseDtoMapper(
    this.dtoMapper,
  );

  constructor(
    @Inject(Deps.ResidenceRepository)
    private readonly repository: IResidenceRepository,
    private readonly commandBus: CommandBus,
    @Inject(Deps.UsersRepository)
    private readonly usersRepository: IUserRepository,
    @Inject(Deps.NotificationService)
    private readonly notificationService: INotificationService,
    @Inject(Deps.GlobalizationService)
    private readonly globalizationService: IGlobalizationService,
  ) {}

  @ApiResponse({
    type: WrapperResponseResidenceDto,
  })
  @Post()
  @RequiredRoles(
    UserRole.Admin,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([
    PermissionCollection.Residences,
    PermissionAction.Create,
  ])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(
    @Body() payload: CreateResidenceDto,
    @CurrentUser("id") userId: string,
  ) {
    const response = await this.repository.createOne({
      ...payload,
      createdBy: userId,
      proprietaire: payload.proprietaire ? payload.proprietaire : userId,
    });

    // Notify all admin users about the new residence
    await this.notifyAdminsNewResidence(response.id);

    return this.responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseResidenceBatchDto,
  })
  @RequiredRoles(
    UserRole.Admin,
    UserRole.Customer,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([PermissionCollection.Residences, PermissionAction.Read])
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
    type: WrapperResponseResidenceBatchDto,
  })
  @Get("/data/public/")
  async readManyPublic(@Query() params: SearchItemsParamsDto) {
    const items = await this.repository.findByQuery(params);

    return this.responseMapper.mapFromQueryResult(items);
  }

  @ApiResponse({
    type: WrapperResponseResidenceBatchDto,
  })
  @Get("/data/public/proprietaire/:proprietaireId")
  async readManyByProprietaire(
    @Param("proprietaireId") proprietaireId: string,
    @Query() params: SearchItemsParamsDto,
  ) {
    params._where = addConditionsToWhereClause(
      [
        {
          _field: "proprietaire",
          _l_op: "and",
          _val: proprietaireId,
        },
      ],
      params._where,
    );

    const items = await this.repository.findByQuery(params);

    return this.responseMapper.mapFromQueryResult(items);
  }

  @ApiResponse({
    type: WrapperResponseResidenceBatchDto,
  })
  @Get("/find-available/public/")
  async findAvailablePublic(@Query() params: SearchItemsParamsDto) {
    const items = await this.repository.findAvailableResidencesForToday(params);
    return items;
  }

  @ApiResponse({
    type: WrapperResponseResidenceBatchDto,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get("data/public/geolocalized")
  async findPublicByGeolocation(
    @Query() params: GeolocalizedItemsSearchParamsQueryDto,
  ) {
    const items = await this.repository.findByGeolocation(params);
    return this.responseMapper.mapFromQueryResult(items);
  }

  @ApiResponse({
    type: WrapperResponseResidenceBatchDto,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get("data/filter/public")
  async findByGeolocationFilter(
    @Query() params: GeolocalizedItemsSearchFiltersParamsQueryDto,
  ) {
    const items = await this.repository.findByGeolocationFilter(params);
    return this.responseMapper.mapFromQueryResult(items);
  }

  @ApiResponse({
    type: WrapperResponseResidenceDto,
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
    type: WrapperResponseResidenceDto,
  })
  @RequiredRoles(
    UserRole.Admin,
    UserRole.Customer,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([PermissionCollection.Residences, PermissionAction.Read])
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
    type: WrapperResponseResidenceDto,
  })
  @RequiredRoles(
    UserRole.Admin,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([
    PermissionCollection.Residences,
    PermissionAction.Update,
  ])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
    @Body() payload: UpdateResidenceByIdCommand,
  ) {
    const response = await this.commandBus.execute(
      new UpdateResidenceByIdCommand({
        ...payload,
        isAdmin: userRole.hasAdminAccess(),
        userId,
        residenceId: id,
      }),
    );

    return this.responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseResidenceDto,
  })
  @RequiredRoles(
    UserRole.Admin,
    UserRole.Customer,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([
    PermissionCollection.Residences,
    PermissionAction.Delete,
  ])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(":id")
  async delete(
    @Param("id") id: string,
    // @CurrentUser("id") userId: string,
    // @CurrentUser("role") userRole: Role,
  ) {
    const query = {
      _where: [
        {
          _field: "id",
          _val: id,
        },
      ],
    };

    // if (!userRole.hasAdminAccess())
    //   query._where.push({ _field: "createdBy", _val: userId });

    await this.repository.deleteByQuery(query);

    return this.responseMapper.mapFrom({ id } as never);
  }

  @ApiResponse({
    type: WrapperResponseResidenceDto,
  })
  @Put("/data/update/all-cordonates")
  async updateAllCordonates() {
    const items = await this.repository.updateAllCordonates();
    return this.responseMapper.mapFromQueryResult(items);
  }

  private async notifyAdminsNewResidence(residenceId: string): Promise<void> {
    try {
      const adminUsers = await this.usersRepository.findAdminUsers();

      const subject = this.globalizationService.t(
        "all.notifications.reservations.nouvelle_residence_admin.subject",
      );
      const message = this.globalizationService.t(
        "all.notifications.reservations.nouvelle_residence_admin.message",
      );

      for (const admin of adminUsers) {
        await this.notificationService.sendNotification({
          userId: admin.id,
          subject,
          message,
          skipInAppNotification: false,
          sendMail: true,
          sendSms: false,
          returnUrl: `/admin/residences/${residenceId}`,
          data: {
            type: PushNotificationType.Residence,
            id: residenceId,
          },
        });
      }
    } catch (error) {
      console.error("Error notifying admins about new residence:", error);
      // Don't throw error to prevent blocking residence creation
    }
  }
}
