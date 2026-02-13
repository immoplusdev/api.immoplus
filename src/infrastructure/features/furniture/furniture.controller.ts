import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CommandBus } from "@nestjs/cqrs";
import { Deps } from "@/core/domain/common/ioc";
import { IFurnitureRepository } from "@/core/domain/furniture";
import {
  CreateFurnitureDto,
  FurnitureDtoMapper,
  WrapperResponseFurnitureDto,
  WrapperResponseFurnitureBatchDto,
} from "./dto";
import { CreateFurnitureCommand } from "@/core/application/furniture";
import {
  CurrentUser,
  RequiredPermissions,
  RequiredRoles,
} from "@/infrastructure/decorators";
import { UserRole } from "@/core/domain/roles";
import {
  PermissionAction,
  PermissionCollection,
} from "@/core/domain/permissions";
import { JwtAuthGuard } from "@/infrastructure/features/auth";
import { WrapperResponseDtoMapper } from "@/lib/responses";
import { SearchItemsParamsDto } from "@/infrastructure/http";
import { ItemNotFoundException } from "@/core/domain/common/exceptions";

@ApiTags("Furniture")
@Controller("furnitures")
export class FurnitureController {
  private readonly logger = new Logger(FurnitureController.name);
  private readonly dtoMapper = new FurnitureDtoMapper();
  private readonly responseMapper = new WrapperResponseDtoMapper(
    this.dtoMapper,
  );

  constructor(
    @Inject(Deps.FurnitureRepository)
    private readonly repository: IFurnitureRepository,
    private readonly commandBus: CommandBus,
  ) {}

  // ─── CREATE ───

  @ApiResponse({ type: WrapperResponseFurnitureDto })
  @Post()
  @RequiredRoles(
    UserRole.Admin,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([
    PermissionCollection.Furnitures,
    PermissionAction.Create,
  ])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(
    @Body() payload: CreateFurnitureDto,
    @CurrentUser("id") userId: string,
  ) {
    this.logger.debug("Create furniture request", {
      lat: payload.lat,
      lng: payload.lng,
      position: payload.position,
    });

    const furniture = await this.commandBus.execute(
      new CreateFurnitureCommand({
        ...payload,
        ownerId: userId,
      }),
    );

    return this.responseMapper.mapFrom(furniture);
  }


  @ApiResponse({ type: WrapperResponseFurnitureBatchDto })
  @Get()
  async readMany(@Query() params: SearchItemsParamsDto) {
    const result = await this.repository.findByQuery(params as any);
    return this.responseMapper.mapFromQueryResult(result);
  }


  @ApiResponse({ type: WrapperResponseFurnitureDto })
  @Get(":id")
  async readOne(@Param("id") id: string) {
    const furniture = await this.repository.findOne(id);
    if (!furniture) throw new ItemNotFoundException();
    return this.responseMapper.mapFrom(furniture);
  }

  // ─── UPDATE ───
  @ApiResponse({ type: WrapperResponseFurnitureDto })
  @Patch(":id")
  @RequiredRoles(
    UserRole.Admin,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([
    PermissionCollection.Furnitures,
    PermissionAction.Update,
  ])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(
    @Param("id") id: string,
    @Body() payload: Partial<CreateFurnitureDto>,
  ) {
    const existing = await this.repository.findOne(id);
    if (!existing) throw new ItemNotFoundException();

    await this.repository.updateOne(id, payload as any);
    const updated = await this.repository.findOne(id);
    return this.responseMapper.mapFrom(updated);
  }

  //  DELETE
  @Delete(":id")
  @RequiredRoles(
    UserRole.Admin,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([
    PermissionCollection.Furnitures,
    PermissionAction.Delete,
  ])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async delete(@Param("id") id: string) {
    const existing = await this.repository.findOne(id);
    if (!existing) throw new ItemNotFoundException();

    await this.repository.deleteOne(id);
    return { message: "Furniture deleted successfully" };
  }
}
