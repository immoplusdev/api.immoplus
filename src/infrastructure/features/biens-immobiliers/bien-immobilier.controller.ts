import { Body, Controller, Delete, Get, Post, Query, Param, Inject, UseGuards, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiResponse } from "@nestjs/swagger";
import { Deps } from "@/core/domain/shared/ioc";
import { IBienImmobilierRepository } from "@/core/domain/biens-immobiliers";
import {
  BienImmobilierDtoMapper,
  CreateBienImmobilierDto,
  CreateBienImmobilierDtoMapper,
  UpdateBienImmobilierDto,
  UpdateBienImmobilierDtoMapper,
  WrapperResponseBienImmobilierDto,
  WrapperResponseBienImmobilierListDto,
} from "@/infrastructure/features/biens-immobiliers";
import { CurrentUser, OwnerAccessRequired, RequiredPermissions, RequiredRoles } from "@/infrastructure/decorators";
import { Role, UserRole } from "@/core/domain/roles";
import { PermissionAction, PermissionCollection } from "@/core/domain/permissions";
import { JwtAuthGuard } from "@/infrastructure/auth";
import { WrapperResponseDtoMapper } from "@/lib/responses";
import { SearchItemsParamsDto, SelectItemsParamsDto } from "@/infrastructure/http";
import { addConditionsToWhereClause } from "@/infrastructure/helpers";
import { WrapperResponseResidenceDto } from "@/infrastructure/features/residences";
import { ItemNotFoundException } from "@/core/domain/shared/exceptions";

@ApiTags("BienImmobilier")
@Controller("biens-immobiliers")
export class BienImmobilierController {

  private readonly dtoMapper = new BienImmobilierDtoMapper();
  private readonly responseMapper = new WrapperResponseDtoMapper(this.dtoMapper);

  constructor(
    @Inject(Deps.BiensImmobiliesRepository)
    private readonly repository: IBienImmobilierRepository,
  ) {
  }

  @ApiResponse({
    type: WrapperResponseBienImmobilierDto,
  })
  @Post()
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.BiensImmobilies, PermissionAction.Create])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(
    @Body() payload: CreateBienImmobilierDto,
    @CurrentUser() userId: string,
  ) {
    const payloadMapper = new CreateBienImmobilierDtoMapper();

    const response = await this.repository.createOne({ ...payloadMapper.mapTo(payload), createdBy: userId });

    return this.responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseBienImmobilierListDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.BiensImmobilies, PermissionAction.Read])
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
    type: WrapperResponseBienImmobilierListDto,
  })
  @Get("/data/public/")
  async readManyPublic(
    @Query() params: SearchItemsParamsDto,
  ) {
    const items = await this.repository.findByQuery(params);

    return this.responseMapper.mapFromQueryResult(items);
  }

  @ApiResponse({
    type: WrapperResponseBienImmobilierDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.BiensImmobilies, PermissionAction.Read])
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
    type: WrapperResponseBienImmobilierDto,
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
    type: WrapperResponseBienImmobilierDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.BiensImmobilies, PermissionAction.Update])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
    @Body() payload: UpdateBienImmobilierDto,
  ) {


    const payloadMapper = new UpdateBienImmobilierDtoMapper();

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
    type: WrapperResponseBienImmobilierDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.BiensImmobilies, PermissionAction.Delete])
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
