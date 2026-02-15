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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
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
import { FilesInterceptor } from "@nestjs/platform-express";
import { IUserRepository } from "@/core/domain/users";

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
    @Inject(Deps.UsersRepository)
    private readonly usersRepository: IUserRepository,
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
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        titre: { type: "string" },
        description: { type: "string" },
        prix: { type: "number" },
        type: { type: "string" },
        category: { type: "string" },
        etat: { type: "string", enum: ["neuf", "reconditionne", "occasion"] },
        adresse: { type: "string" },
        ville: { type: "string", format: "uuid", nullable: true },
        commune: { type: "string", format: "uuid", nullable: true },
        lat: { type: "number", nullable: true },
        lng: { type: "number", nullable: true },
        position: { type: "object", nullable: true },
        status: { type: "string", nullable: true },
        metadata: {
          type: "object",
          nullable: true,
          properties: {
            colors: {
              type: "array",
              items: { type: "string", example: "#D7A86E" },
            },
          },
        },
        images: {
          type: "array",
          items: { type: "string", format: "binary" },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor("images", 10))
  async create(
    @Body() payload: CreateFurnitureDto,
    @CurrentUser("id") userId: string,
    @UploadedFiles() uploadedImages?: Express.Multer.File[],
  ) {
    this.logger.debug("Create furniture request", {
      lat: payload.lat,
      lng: payload.lng,
      position: payload.position,
      uploadedImagesCount: uploadedImages?.length ?? 0,
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
    const ownerIds = [
      ...new Set(
        (result.data || [])
          .map((item) => item.ownerId || item.owner)
          .filter(Boolean),
      ),
    ] as string[];

    const ownerPhoneById = new Map<string, string>();
    await Promise.all(
      ownerIds.map(async (ownerId) => {
        const phone = await this.resolveOwnerPhoneNumber(ownerId);
        if (phone) ownerPhoneById.set(ownerId, phone);
      }),
    );

    result.data = (result.data || []).map((item) => {
      const resolvedOwnerId = item.ownerId || item.owner;
      return {
        ...item,
        ownerPhoneNumber:
          item.ownerPhoneNumber || ownerPhoneById.get(resolvedOwnerId) || null,
      };
    });
    return this.responseMapper.mapFromQueryResult(result);
  }


  @ApiResponse({ type: WrapperResponseFurnitureDto })
  @Get(":id")
  async readOne(@Param("id") id: string) {
    const furniture = await this.repository.findOne(id);
    if (!furniture) throw new ItemNotFoundException();
    const resolvedOwnerId = furniture.ownerId || furniture.owner;
    if (resolvedOwnerId && !furniture.ownerPhoneNumber)
      furniture.ownerPhoneNumber = await this.resolveOwnerPhoneNumber(
        resolvedOwnerId,
      );
    if (!furniture.ownerPhoneNumber) furniture.ownerPhoneNumber = null;
    return this.responseMapper.mapFrom(furniture);
  }

  private async resolveOwnerPhoneNumber(ownerId: string): Promise<string | null> {
    const owner = await this.usersRepository.findOne(ownerId, {
      fields: ["id", "phoneNumber"],
      relations: [],
      withDeleted: true,
    });
    return owner?.phoneNumber || null;
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
