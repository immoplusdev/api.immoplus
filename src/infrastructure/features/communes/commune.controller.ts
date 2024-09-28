import { Body, Controller, Delete, Get, Post, Query, Param, Inject, UseGuards, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiResponse } from "@nestjs/swagger";
import { Deps } from "@/core/domain/shared/ioc";
import { ICommuneRepository } from "@/core/domain/communes";
import {
  CreateCommuneDto,
  UpdateCommuneDto,
  WrapperResponseCommuneDto,
  WrapperResponseCommuneListDto, CommuneDtoMapper,
} from "@/infrastructure/features/communes";
import { CurrentUser, OwnerAccessRequired, RequiredPermissions, RequiredRoles } from "@/infrastructure/decorators";
import { Role, UserRole } from "@/core/domain/roles";
import { PermissionAction, PermissionCollection } from "@/core/domain/permissions";
import { WrapperResponseDtoMapper } from "@/lib/responses";
import { SearchItemsParamsDto, SelectItemsParamsDto } from "@/infrastructure/http";
import { JwtAuthGuard } from "@/infrastructure/features/auth";

@ApiTags("Commune")
@Controller("communes")
export class CommuneController {

  private readonly dtoMapper = new CommuneDtoMapper();
  private readonly responseMapper = new WrapperResponseDtoMapper(this.dtoMapper);

  constructor(
    @Inject(Deps.CommuneRepository)
    private readonly repository: ICommuneRepository,
  ) {
  }

  @ApiResponse({
    type: WrapperResponseCommuneDto,
  })
  @Post()
  @RequiredRoles(UserRole.Admin)
  @RequiredPermissions([PermissionCollection.Communes, PermissionAction.Create])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(
    @Body() payload: CreateCommuneDto,
    @CurrentUser("id") userId: string,
  ) {
    const response = await this.repository.createOne({
      name: payload.name,
      ville: payload.villeId,
    });

    return this.responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseCommuneListDto,
  })
  @Get()
  async readMany(
    @Query() params: SearchItemsParamsDto,
  ) {
    const items = await this.repository.findByQuery(params);

    return this.responseMapper.mapFromQueryResult(items);
  }

  @ApiResponse({
    type: WrapperResponseCommuneDto,
  })
  @Get(":id")
  async readOne(
    @Param("id") id: string,
    @Query() params?: SelectItemsParamsDto,
  ) {
    const item = await this.repository.findOne(id, { fields: params?._select });

    return this.responseMapper.mapFrom(item);
  }


  @ApiResponse({
    type: WrapperResponseCommuneDto,
  })
  @RequiredRoles(UserRole.Admin)
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

    return this.responseMapper.mapFrom((await this.repository.findByQuery(query)).data.at(0));
  }


  @ApiResponse({
    type: WrapperResponseCommuneDto,
  })
  @RequiredRoles(UserRole.Admin)
  @RequiredPermissions([PermissionCollection.Communes, PermissionAction.Delete])
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
