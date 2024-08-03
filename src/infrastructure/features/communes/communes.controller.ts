import { Body, Controller, Delete, Get, Post, Query, Param, Inject, UseGuards, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiResponse } from "@nestjs/swagger";
import { Deps } from "@/core/domain/shared/ioc";
import { ICommuneRepository } from "@/core/domain/communes";
import {
  CreateCommuneDto,
  CommuneDto,
  UpdateCommuneDto,
  WrapperResponseCommuneDto,
  WrapperResponseCommuneListDto,
} from "@/infrastructure/features/communes";
import { CurrentUser, OwnerAccessRequired, RequiredPermissions, RequiredRoles } from "@/infrastructure/decorators";
import { Role, UserRole } from "@/core/domain/roles";
import { PermissionAction, PermissionCollection } from "@/core/domain/permissions";
import { JwtAuthGuard } from "@/infrastructure/auth";
import { WrapperResponseDtoMapper } from "@/lib/responses";
import { SearchItemsParamsDto, SelectItemsParamsDto } from "@/infrastructure/http";
import { addConditionsToWhereClause } from "@/infrastructure/helpers";

@ApiTags("Commune")
@Controller("communes")
export class CommuneController {
  constructor(
    @Inject(Deps.CommuneRepository)
    private readonly repository: ICommuneRepository,
  ) {
  }

  @ApiResponse({
    type: WrapperResponseCommuneDto,
  })
  @Post()
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Communes, PermissionAction.Create])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(
    @Body() payload: CreateCommuneDto,
    @CurrentUser() userId: string,
  ) {

    const responseMapper = new WrapperResponseDtoMapper<CommuneDto>();

    const response = await this.repository.createOne({ ...payload, createdBy: userId });

    return responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseCommuneListDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Communes, PermissionAction.Read])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @OwnerAccessRequired("createdBy")
  @Get()
  async readMany(
    @Query() params: SearchItemsParamsDto,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
  ) {

    const responseMapper = new WrapperResponseDtoMapper<CommuneDto[]>();

    if (!userRole.hasAdminAccess()) params._where = addConditionsToWhereClause([{
      _field: "createdBy",
      _l_op: "and",
      _val: userId,
    }], params._where);

    const items = await this.repository.findByQuery(params);

    return responseMapper.mapFrom(items);
  }

  @ApiResponse({
    type: WrapperResponseCommuneDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Communes, PermissionAction.Read])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @OwnerAccessRequired("createdBy")
  @Get(":id")
  async readOne(
    @Param("id") id: string,
    @Query() params?: SelectItemsParamsDto,
  ) {
    const responseMapper = new WrapperResponseDtoMapper<CommuneDto>();

    const item = await this.repository.findOne(id, params?._select);

    return responseMapper.mapFrom(item);
  }


  @ApiResponse({
    type: WrapperResponseCommuneDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Communes, PermissionAction.Update])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
    @Body() payload: UpdateCommuneDto,
  ) {
    const responseMapper = new WrapperResponseDtoMapper<CommuneDto>();
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

    return responseMapper.mapFrom((await this.repository.findByQuery(query)).at(0));
  }


  @ApiResponse({
    type: WrapperResponseCommuneDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Communes, PermissionAction.Delete])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(":id")
  async delete(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role) {

    const responseMapper = new WrapperResponseDtoMapper<CommuneDto>();
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
