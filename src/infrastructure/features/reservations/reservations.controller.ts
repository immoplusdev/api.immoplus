import { Body, Controller, Delete, Get, Post, Query, Param, Inject, UseGuards, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiResponse } from "@nestjs/swagger";
import { Deps } from "@/core/domain/shared/ioc";
import { Reservation, IReservationRepository } from "@/core/domain/reservations";
import {
  CreateReservationDto,
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

@ApiTags("Reservation")
@Controller("reservations")
export class ReservationController {
  constructor(
    @Inject(Deps.ReservationRepository)
    private readonly repository: IReservationRepository,
  ) {
  }

  @ApiResponse({
    type: WrapperResponseReservationDto,
  })
  @Post()
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Reservations, PermissionAction.Create])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(
    @Body() payload: CreateReservationDto,
    @CurrentUser() userId: string,
  ) {

    const responseMapper = new WrapperResponseDtoMapper<ReservationDto>();

    const response = await this.repository.createOne({ ...payload, createdBy: userId });

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

    if (!userRole.hasAdminAccess()) params._where = addConditionsToWhereClause([{
      _field: "createdBy",
      _l_op: "and",
      _val: userId,
    }], params._where);

    const items = await this.repository.findByQuery(params);

    return responseMapper.mapFromQueryResult(items);
  }

  @ApiResponse({
    type: WrapperResponseReservationDto,
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
    const responseMapper = new WrapperResponseDtoMapper<ReservationDto>();

    const item = await this.repository.findOne(id, params?._select);

    return responseMapper.mapFrom(item);
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
    type: WrapperResponseReservationDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Reservations, PermissionAction.Delete])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(":id")
  async delete(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role) {

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

    await this.repository.deleteByQuery(query);

    return responseMapper.mapFrom({ id } as never);
  }

}
