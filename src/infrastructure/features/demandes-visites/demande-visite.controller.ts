import { Body, Controller, Delete, Get, Post, Query, Param, Inject, UseGuards, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiResponse } from "@nestjs/swagger";
import { Deps } from "@/core/domain/shared/ioc";
import { IDemandeVisiteRepository } from "@/core/domain/demandes-visites";
import {
  DemandeVisiteDtoMapper,
  CreateDemandeVisiteDto,
  CreateDemandeVisiteDtoMapper,
  UpdateDemandeVisiteDto,
  UpdateDemandeVisiteDtoMapper,
  WrapperResponseDemandeVisiteDto,
  WrapperResponseDemandeVisiteListDto,
  WrapperResponseEstimerPrixDemandeVisiteQueryResponseDto,
  EstimerPrixDemandeVisiteQueryDto, EstimerPrixDemandeVisiteQueryResponseDto,
} from "@/infrastructure/features/demandes-visites";
import { CurrentUser, OwnerAccessRequired, RequiredPermissions, RequiredRoles } from "@/infrastructure/decorators";
import { Role, UserRole } from "@/core/domain/roles";
import { PermissionAction, PermissionCollection } from "@/core/domain/permissions";
import { JwtAuthGuard } from "@/infrastructure/auth";
import { WrapperResponseDtoMapper } from "@/lib/responses";
import { SearchItemsParamsDto, SelectItemsParamsDto } from "@/infrastructure/http";
import { addConditionsToWhereClause } from "@/infrastructure/helpers";
import {
  EstimerPrixReservationQueryDto, EstimerPrixReservationQueryResponseDto,
  WrapperResponseEstimerPrixReservationQueryResponseDto,
} from "@/infrastructure/features/reservations";
import { EstimerPrixReservationQuery } from "@/core/application/features/reservations";
import {
  EstimerPrixDemandeVisiteQuery, EstimerPrixDemandeVisiteQueryResponse,
  WrapperResponseEstimerPrixDemandeVisiteQueryResponse,
} from "@/core/application/features/demandes-visites";
import { CommandBus, QueryBus } from "@nestjs/cqrs";

@ApiTags("DemandeVisite")
@Controller("demande-visite")
export class DemandeVisiteController {

  private readonly dtoMapper = new DemandeVisiteDtoMapper();
  private readonly responseMapper = new WrapperResponseDtoMapper(this.dtoMapper);

  constructor(
    readonly queryBus: QueryBus,
    readonly commandBus: CommandBus,
    @Inject(Deps.DemandeVisiteRepository)
    private readonly repository: IDemandeVisiteRepository,
  ) {
  }


  @ApiResponse({
    type: WrapperResponseEstimerPrixDemandeVisiteQueryResponseDto,
  })
  @Post("estimer-prix")
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.DemandesVisites, PermissionAction.Create])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async estimerPrixDemandeVisite(
    @Body() payload: EstimerPrixDemandeVisiteQueryDto,
  ) {
    const responseMapper = new WrapperResponseDtoMapper<EstimerPrixDemandeVisiteQueryResponseDto>();
    const query = new EstimerPrixDemandeVisiteQuery(payload);

    const response = await this.queryBus.execute(query);
    return responseMapper.mapFrom(response);
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
    @Body() payload: CreateDemandeVisiteDto,
    @CurrentUser() userId: string,
  ) {

    const payloadMapper = new CreateDemandeVisiteDtoMapper();

    const response = await this.repository.createOne({ ...payloadMapper.mapTo(payload), createdBy: userId });

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
    type: WrapperResponseDemandeVisiteDto,
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
    const item = await this.repository.findOne(id, { fields: params?._select });

    return this.responseMapper.mapFrom(item);
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
    type: WrapperResponseDemandeVisiteDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.DemandesVisites, PermissionAction.Delete])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(":id")
  async delete(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role) {
    const query = {
      _where: [
        {
          _field: "id",
          _val: id,
        },
      ],
    };

    if (!userRole.hasAdminAccess()) query._where.push({ _field: "createdBy", _val: userId });

    await this.repository.deleteByQuery(query);

    return this.responseMapper.mapFrom({ id } as never);
  }

}
