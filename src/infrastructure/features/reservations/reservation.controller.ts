import { Body, Controller, Get, Post, Query, Param, Inject, UseGuards, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiResponse } from "@nestjs/swagger";
import { Deps } from "@/core/domain/shared/ioc";
import { IReservationRepository } from "@/core/domain/reservations";
import {
  ReservationDto,
  UpdateReservationDto,
  WrapperResponseReservationDto,
  WrapperResponseReservationListDto,
} from "@/infrastructure/features/reservations";
import { CurrentUser, OwnerAccessRequired, RequiredPermissions, RequiredRoles } from "@/infrastructure/decorators";
import { Role, UserRole } from "@/core/domain/roles";
import { PermissionAction, PermissionCollection } from "@/core/domain/permissions";
import { JwtAuthGuard } from "@/infrastructure/auth";
import { WrapperResponseDtoMapper } from "@/lib/responses";
import { SearchItemsParamsDto, SelectItemsParamsDto } from "@/infrastructure/http";
import { addConditionsToWhereClause } from "@/infrastructure/helpers";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
  AnnulerReservationByIdCommand,
  AnnulerReservationByIdCommandResponse,
  CreateReservationCommand,
  EstimerPrixReservationQuery,
  EstimerPrixReservationQueryResponse,
  GetReservationByIdQuery, GetReservationByIdQueryResponse,
  GetResidenceOccupiedDatesQuery, GetResidenceOccupiedDatesQueryResponse,
  WrapperResponseAnnulerReservationByIdCommandResponseDto,
  WrapperResponseEstimerPrixReservationQueryResponseDto,
  WrapperResponseGetReservationByIdQueryResponseDto, WrapperResponseGetResidenceOccupiedDatesQueryResponseDto,
} from "@/core/application/features/reservations";
import { UnauthorizedException } from "@/core/domain/auth";



@ApiTags("Reservation")
@Controller("reservations")
export class ReservationController {
  constructor(
    readonly queryBus: QueryBus,
    readonly commandBus: CommandBus,
    @Inject(Deps.ReservationRepository)
    private readonly repository: IReservationRepository,
  ) {
  }


  @ApiResponse({
    type: WrapperResponseGetReservationByIdQueryResponseDto,
  })
  @Post()
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Reservations, PermissionAction.Create])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(
    @Body() payload: CreateReservationCommand,
    @CurrentUser("id") userId: string,
  ) {
    const responseMapper = new WrapperResponseDtoMapper<GetReservationByIdQueryResponse>();
    const command = new CreateReservationCommand({
      ...payload,
      userId,
    });

    const response = await this.commandBus.execute(command);
    return responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseReservationListDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Reservations, PermissionAction.Read])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @OwnerAccessRequired("createdBy")
  @Get()
  async readMany(
    @Query() params: SearchItemsParamsDto,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
  ) {

    const responseMapper = new WrapperResponseDtoMapper<ReservationDto[]>();

    if (!userRole.hasAdminAccess()) params._where = addConditionsToWhereClause([
      {
        _field: "createdBy",
        _l_op: "or",
        _val: userId,
      }], params._where);

    const items = await this.repository.findByQuery(params);

    return responseMapper.mapFromQueryResult(items);
  }


  @ApiResponse({
    type: WrapperResponseReservationListDto,
  })
  @RequiredRoles(UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Reservations, PermissionAction.Read])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @OwnerAccessRequired("createdBy")
  @Get("data/residence/owner/:id")
  async readManyByOwnerId(
    @Param("id") ownerId: string,
    @Query() params: SearchItemsParamsDto,
    @CurrentUser("id") userId: string,
  ) {

    if (ownerId !== userId) throw new UnauthorizedException();

    const responseMapper = new WrapperResponseDtoMapper<ReservationDto[]>();

    const items = await this.repository.findByResidenceOwnerId(ownerId, params);

    return responseMapper.mapFromQueryResult(items);
  }


  @ApiResponse({
    type: WrapperResponseGetResidenceOccupiedDatesQueryResponseDto,
  })
  @Get("data/residence/occupied-dates/:residence")
  async getResidenceOccupiedDates(
    @Param("residence") residenceId: string,
  ) {
    const responseMapper = new WrapperResponseDtoMapper<GetResidenceOccupiedDatesQueryResponse>();
    const query = new GetResidenceOccupiedDatesQuery({ residenceId });


    const response = await this.queryBus.execute(query);

    return responseMapper.mapFrom(response);
  }


  @ApiResponse({
    type: WrapperResponseGetReservationByIdQueryResponseDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Reservations, PermissionAction.Read])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @OwnerAccessRequired("createdBy")
  @Get(":id")
  async readOne(
    @Param("id") id: string,
    @Query() params?: SelectItemsParamsDto,
  ) {
    const responseMapper = new WrapperResponseDtoMapper<GetReservationByIdQueryResponse>();
    const query = new GetReservationByIdQuery(({ id }));

    const response = await this.queryBus.execute(query);
    return responseMapper.mapFrom(response);
  }


  @ApiResponse({
    type: WrapperResponseReservationDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Reservations, PermissionAction.Update])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
    @Body() payload: UpdateReservationDto,
  ) {
    const responseMapper = new WrapperResponseDtoMapper<ReservationDto>();
    const query = {
      _where: [
        {
          _field: "id",
          _val: id,
        },
      ],
    };

    if (!userRole.hasAdminAccess()) query._where.push({ _field: "createdBy", _val: userId });

    await this.repository.updateByQuery(query, payload);

    return responseMapper.mapFrom((await this.repository.findByQuery(query)).data.at(0));
  }


  @ApiResponse({
    type: WrapperResponseEstimerPrixReservationQueryResponseDto,
  })
  @Post("action/estimer-prix")
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Reservations, PermissionAction.Create])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async estimerPrixReservation(
    @Body() payload: EstimerPrixReservationQuery,
  ) {
    const responseMapper = new WrapperResponseDtoMapper<EstimerPrixReservationQueryResponse>();
    const query = new EstimerPrixReservationQuery(payload);

    const response = await this.queryBus.execute(query);
    return responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseAnnulerReservationByIdCommandResponseDto,
  })
  @Post("action/annuler/:id")
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Reservations, PermissionAction.Delete])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async annulerReservationById(
    @Param("id") reservationId: string,
    @CurrentUser("id") userId: string,
  ) {
    const responseMapper = new WrapperResponseDtoMapper<AnnulerReservationByIdCommandResponse>();
    const command = new AnnulerReservationByIdCommand({ reservation: reservationId, userId });

    const response = await this.commandBus.execute(command);
    return responseMapper.mapFrom(response);
  }
}
