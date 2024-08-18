import { Body, Controller, Get, Post, Query, Param, Inject, UseGuards, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiResponse } from "@nestjs/swagger";
import { Deps } from "@/core/domain/shared/ioc";
import { IDemandeVisiteRepository } from "@/core/domain/demandes-visites";
import {
  DemandeVisiteDto,
  DemandeVisiteDtoMapper,
  UpdateDemandeVisiteDto,
  UpdateDemandeVisiteDtoMapper,
  WrapperResponseDemandeVisiteDto,
  WrapperResponseDemandeVisiteListDto,
} from "@/infrastructure/features/demandes-visites";
import { CurrentUser, OwnerAccessRequired, RequiredPermissions, RequiredRoles } from "@/infrastructure/decorators";
import { Role, UserRole } from "@/core/domain/roles";
import { PermissionAction, PermissionCollection } from "@/core/domain/permissions";
import { JwtAuthGuard } from "@/infrastructure/auth";
import { WrapperResponseDtoMapper } from "@/lib/responses";
import { SearchItemsParamsDto, SelectItemsParamsDto } from "@/infrastructure/http";
import { addConditionsToWhereClause } from "@/infrastructure/helpers";
import {
  EstimerPrixDemandeVisiteQuery, EstimerPrixDemandeVisiteQueryResponse,
  GetBienImmobilierOccupiedDatesQuery, GetDemandeVisiteByIdQuery,
  WrapperResponseEstimerPrixDemandeVisiteQueryResponseDto, WrapperResponseGetDemandeVisiteByIdQueryResponseDto,
} from "@/core/application/features/demandes-visites";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateDemandeVisiteCommand } from "@/core/application/features/demandes-visites/create-demande-visite.command";
import { UnauthorizedException } from "@/core/domain/auth";
import { WrapperResponseGetResidenceOccupiedDatesQueryResponseDto } from "@/core/application/features/reservations";


@ApiTags("DemandeVisite")
@Controller("demandes-visites")
export class DemandeVisiteController {

  private readonly dtoMapper = new DemandeVisiteDtoMapper();
  private readonly responseMapper = new WrapperResponseDtoMapper(this.dtoMapper);
  private readonly autoMapper = new WrapperResponseDtoMapper();

  constructor(
    readonly queryBus: QueryBus,
    readonly commandBus: CommandBus,
    @Inject(Deps.DemandeVisiteRepository)
    private readonly repository: IDemandeVisiteRepository,
  ) {
  }


  @ApiResponse({
    type: WrapperResponseDemandeVisiteDto,
  })
  @Post()
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.DemandesVisites, PermissionAction.Create])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(
    @Body() payload: CreateDemandeVisiteCommand,
    @CurrentUser("id") userId: string,
  ) {
    const command = new CreateDemandeVisiteCommand({ ...payload, userId });

    const response = await this.commandBus.execute(command);

    return this.responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseDemandeVisiteListDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.DemandesVisites, PermissionAction.Read])
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

    const items = await this.repository.findByQuery(params);

    return this.responseMapper.mapFromQueryResult(items);
  }


  @ApiResponse({
    type: WrapperResponseGetDemandeVisiteByIdQueryResponseDto,
  })
  @Get("data/bien-immobilier/occupied-dates/:id")
  async getResidenceOccupiedDates(
    @Param("id") bienImmobilierId: string,
  ) {
    const responseMapper = new WrapperResponseGetResidenceOccupiedDatesQueryResponseDto();
    const query = new GetBienImmobilierOccupiedDatesQuery({ bienImmobilierId });

    const response = await this.queryBus.execute(query);

    return responseMapper.setData(response);
  }


  @ApiResponse({
    type: WrapperResponseDemandeVisiteListDto,
  })
  @RequiredRoles(UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.DemandesVisites, PermissionAction.Read])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @OwnerAccessRequired("createdBy")
  @Get("data/bien-immobilier/owner/:id")
  async readManyByOwnerId(
    @Param("id") ownerId: string,
    @Query() params: SearchItemsParamsDto,
    @CurrentUser("id") userId: string,
  ) {

    if (ownerId !== userId) throw new UnauthorizedException();

    const items = await this.repository.findByBienImmobilierOwnerId(ownerId, params);

    return this.responseMapper.mapFromQueryResult(items);
  }


  @ApiResponse({
    type: WrapperResponseGetDemandeVisiteByIdQueryResponseDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.DemandesVisites, PermissionAction.Read])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @OwnerAccessRequired("createdBy")
  @Get(":id")
  async readOne(
    @Param("id") id: string,
    @Query() params?: SelectItemsParamsDto,
  ) {
    const item = await this.queryBus.execute(new GetDemandeVisiteByIdQuery({ id }));

    return this.autoMapper.mapFrom(item);
  }


  @ApiResponse({
    type: WrapperResponseDemandeVisiteDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.DemandesVisites, PermissionAction.Update])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
    @Body() payload: UpdateDemandeVisiteDto,
  ) {

    const payloadMapper = new UpdateDemandeVisiteDtoMapper();

    const query = {
      _where: [
        {
          _field: "id",
          _val: id,
        },
      ],
    };

    if (!userRole.hasAdminAccess()) query._where.push({ _field: "createdBy", _val: userId });

    await this.repository.updateByQuery(query, { ...payloadMapper.mapTo(payload), createdBy: userId });

    return this.responseMapper.mapFrom((await this.repository.findByQuery(query)).data.at(0));
  }

  @ApiResponse({
    type: WrapperResponseEstimerPrixDemandeVisiteQueryResponseDto,
  })
  @Post("action/estimer-prix")
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.DemandesVisites, PermissionAction.Create])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async estimerPrixDemandeVisite(
    @Body() payload: EstimerPrixDemandeVisiteQuery,
  ) {
    const responseMapper = new WrapperResponseDtoMapper<EstimerPrixDemandeVisiteQueryResponse>();
    const query = new EstimerPrixDemandeVisiteQuery(payload);

    const response = await this.queryBus.execute(query);
    return responseMapper.mapFrom(response);
  }


}
