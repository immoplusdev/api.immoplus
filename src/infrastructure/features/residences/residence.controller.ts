import { Body, Controller, Delete, Get, Post, Query, Param, Inject, UseGuards, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiResponse } from "@nestjs/swagger";
import { Deps } from "@/core/domain/shared/ioc";
import { IResidenceRepository, Residence } from "@/core/domain/residences";
import {
  CreateResidenceDto,
  ResidenceDtoMapper,
  WrapperResponseResidenceDto,
  WrapperResponseResidenceListDto,
} from "@/infrastructure/features/residences";
import { CurrentUser, OwnerAccessRequired, RequiredPermissions, RequiredRoles } from "@/infrastructure/decorators";
import { Role, UserRole } from "@/core/domain/roles";
import { PermissionAction, PermissionCollection } from "@/core/domain/permissions";
import { JwtAuthGuard } from "@/infrastructure/auth";
import { WrapperResponseDtoMapper } from "@/lib/responses";
import { SearchItemsParamsDto, SelectItemsParamsDto } from "@/infrastructure/http";
import { addConditionsToWhereClause } from "@/infrastructure/helpers";
import { ItemNotFoundException } from "@/core/domain/shared/exceptions";
import { UpdateResidenceByIdCommand } from "@/core/application/features/residences";
import { CommandBus } from "@nestjs/cqrs";

@ApiTags("Residence")
@Controller("residences")
export class ResidenceController {
  private readonly dtoMapper = new ResidenceDtoMapper();
  private readonly responseMapper = new WrapperResponseDtoMapper(this.dtoMapper);

  constructor(
    @Inject(Deps.ResidenceRepository)
    private readonly repository: IResidenceRepository,
    private readonly commandBus: CommandBus,
  ) {
  }

  @ApiResponse({
    type: WrapperResponseResidenceDto,
  })
  @Post()
  @RequiredRoles(UserRole.Admin, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Residences, PermissionAction.Create])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(
    @Body() payload: CreateResidenceDto,
    @CurrentUser("id") userId: string,
  ) {

    const proprietaire = payload.proprietaire ? payload.proprietaire : userId;
    console.log(proprietaire);
    const response = await this.repository.createOne({
      ...payload,
      createdBy: userId,
      proprietaire,
    });

    return this.responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseResidenceListDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
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
    if (!userRole.hasAdminAccess()) params._where = addConditionsToWhereClause([{
      _field: "createdBy",
      _l_op: "and",
      _val: userId,
    }], params._where);

    const items = await this.repository.findByQuery(params);

    return this.responseMapper.mapFromQueryResult(items);
  }

  @ApiResponse({
    type: WrapperResponseResidenceListDto,
  })
  @Get("/data/public/")
  async readManyPublic(
    @Query() params: SearchItemsParamsDto,
  ) {
    const items = await this.repository.findByQuery(params);

    return this.responseMapper.mapFromQueryResult(items);
  }


  @ApiResponse({
    type: WrapperResponseResidenceDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
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
  @RequiredRoles(UserRole.Admin, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Residences, PermissionAction.Update])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
    @Body() payload: UpdateResidenceByIdCommand,
  ) {
    const response = await this.commandBus.execute(new UpdateResidenceByIdCommand({
      ...payload,
      isAdmin: userRole.hasAdminAccess(),
      userId,
      residenceId: id,
    }));

    return this.responseMapper.mapFrom(response);
  }


  @ApiResponse({
    type: WrapperResponseResidenceDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Residences, PermissionAction.Delete])
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
