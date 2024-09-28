import { Body, Controller, Get, Post, Query, Param, Inject, UseGuards, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiResponse } from "@nestjs/swagger";
import { Deps } from "@/core/domain/shared/ioc";
import { IDemandeVisiteRepository } from "@/core/domain/demandes-visites";
import {
  DemandeVisiteDtoMapper,
  UpdateDemandeVisiteDto,
  UpdateDemandeVisiteDtoMapper,
  WrapperResponseDemandeVisiteDto,
  WrapperResponseDemandeVisiteListDto,
} from "@/infrastructure/features/demandes-visites";
import { CurrentUser, OwnerAccessRequired, RequiredPermissions, RequiredRoles } from "@/infrastructure/decorators";
import { Role, UserRole } from "@/core/domain/roles";
import { PermissionAction, PermissionCollection } from "@/core/domain/permissions";
import { WrapperResponseDtoMapper } from "@/lib/responses";
import { SearchItemsParamsDto, SelectItemsParamsDto } from "@/infrastructure/http";
import { addConditionsToWhereClause } from "@/infrastructure/helpers";
import {
  AnnulerDemandeVisiteByIdCommand,
  EstimerPrixDemandeVisiteQuery,
  EstimerPrixDemandeVisiteQueryResponse,
  GetBienImmobilierOccupiedDatesQuery,
  GetDemandeVisiteByIdQuery, ProgrammerDemandeVisiteCommand,
  WrapperResponseAnnulerDemandeVisiteByIdCommandResponseDto,
  WrapperResponseAnnulerDemandeVisiteCommandResponseDtoMapper,
  WrapperResponseCreateDemandeVisiteCommandResponseDtoMapper,
  WrapperResponseCreateDemandeVisiteResponseDto,
  WrapperResponseEstimerPrixDemandeVisiteQueryResponseDto,
  WrapperResponseGetDemandeVisiteByIdQueryResponseDto,
  WrapperResponseProgrammerDemandeVisiteCommandResponseDto,
  WrapperResponseProgrammerDemandeVisiteCommandResponseDtoMapper,
} from "@/core/application/features/demandes-visites";
import { CommandBus, IQueryBus, QueryBus } from "@nestjs/cqrs";
import { CreateDemandeVisiteCommand } from "@/core/application/features/demandes-visites/create-demande-visite.command";
import { UnauthorizedException } from "@/core/domain/auth";
import {
  AnnulerReservationByIdCommand,
  AnnulerReservationByIdCommandResponse,
  WrapperResponseAnnulerReservationByIdCommandResponseDto,
  WrapperResponseGetResidenceOccupiedDatesQueryResponseDto,
} from "@/core/application/features/reservations";
import { JwtAuthGuard } from "@/infrastructure/features/auth";


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
    type: WrapperResponseCreateDemandeVisiteResponseDto,
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
    const responseMapper = new WrapperResponseCreateDemandeVisiteCommandResponseDtoMapper();

    const command = new CreateDemandeVisiteCommand({ ...payload, userId });

    const response = await this.commandBus.execute(command);

    return responseMapper.mapFrom(response);
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
    type: WrapperResponseGetResidenceOccupiedDatesQueryResponseDto,
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


  @ApiResponse({
    type: WrapperResponseAnnulerDemandeVisiteByIdCommandResponseDto,
  })
  @Post("action/annuler/:id")
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.DemandesVisites, PermissionAction.Delete])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async annulerDemandeVisiteById(
    @Param("id") demandeVisiteId: string,
    @CurrentUser("id") userId: string,
  ) {
    const responseMapper = new WrapperResponseAnnulerDemandeVisiteCommandResponseDtoMapper();
    const command = new AnnulerDemandeVisiteByIdCommand({ demandeVisite: demandeVisiteId, userId });

    const response = await this.commandBus.execute(command);
    return responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseProgrammerDemandeVisiteCommandResponseDto,
  })
  @Post("action/programmer/:id")
  @RequiredRoles(UserRole.Admin, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.DemandesVisites, PermissionAction.Update])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async programmerDemandeVisiteById(
    @Param("id") demandeVisiteId: string,
    @Body() payload: ProgrammerDemandeVisiteCommand,
  ) {
    const responseMapper = new WrapperResponseProgrammerDemandeVisiteCommandResponseDtoMapper();
    const command = new ProgrammerDemandeVisiteCommand({ id: demandeVisiteId, datesDemandeVisite: payload.datesDemandeVisite });

    const response = await this.commandBus.execute(command);
    return responseMapper.mapFrom(response);
  }
}
