import { Body, Controller, Delete, Get, Post, Query, Param, Inject, UseGuards, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiResponse } from "@nestjs/swagger";
import { Deps } from "@/core/domain/shared/ioc";
import { IVilleRepository } from "@/core/domain/villes";
import {
  CreateVilleDto,
  VilleDto,
  UpdateVilleDto,
  WrapperResponseVilleDto,
  WrapperResponseVilleListDto,
} from "@/infrastructure/features/villes";
import { CurrentUser, RequiredPermissions, RequiredRoles } from "@/infrastructure/decorators";
import { Role, UserRole } from "@/core/domain/roles";
import { PermissionAction, PermissionCollection } from "@/core/domain/permissions";
import { WrapperResponseDtoMapper } from "@/lib/responses";
import { SearchItemsParamsDto, SelectItemsParamsDto } from "@/infrastructure/http";
import { JwtAuthGuard } from "@/infrastructure/features/auth";

@ApiTags("Ville")
@Controller("villes")
export class VilleController {
  constructor(
    @Inject(Deps.VilleRepository)
    private readonly repository: IVilleRepository,
  ) {
  }

  @ApiResponse({
    type: WrapperResponseVilleDto,
  })
  @Post()
  @RequiredRoles(UserRole.Admin)
  @RequiredPermissions([PermissionCollection.Villes, PermissionAction.Create])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(
    @Body() payload: CreateVilleDto,
    @CurrentUser("id") userId: string,
  ) {

    const responseMapper = new WrapperResponseDtoMapper<VilleDto>();

    const response = await this.repository.createOne({ ...payload, createdBy: userId });

    return responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseVilleListDto,
  })
  @Get()
  async readMany(
    @Query() params: SearchItemsParamsDto,
  ) {

    const responseMapper = new WrapperResponseDtoMapper<VilleDto[]>();

    const items = await this.repository.findByQuery(params);

    return responseMapper.mapFromQueryResult(items);
  }

  @ApiResponse({
    type: WrapperResponseVilleDto,
  })
  @Get(":id")
  async readOne(
    @Param("id") id: string,
    @Query() params?: SelectItemsParamsDto,
  ) {
    const responseMapper = new WrapperResponseDtoMapper<VilleDto>();

    const item = await this.repository.findOne(id, { fields: params?._select });

    return responseMapper.mapFrom(item);
  }


  @ApiResponse({
    type: WrapperResponseVilleDto,
  })
  @RequiredRoles(UserRole.Admin)
  @RequiredPermissions([PermissionCollection.Villes, PermissionAction.Update])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
    @Body() payload: UpdateVilleDto,
  ) {
    const responseMapper = new WrapperResponseDtoMapper<VilleDto>();
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
    type: WrapperResponseVilleDto,
  })
  @RequiredRoles(UserRole.Admin)
  @RequiredPermissions([PermissionCollection.Villes, PermissionAction.Delete])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(":id")
  async delete(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role) {

    const responseMapper = new WrapperResponseDtoMapper<VilleDto>();
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
