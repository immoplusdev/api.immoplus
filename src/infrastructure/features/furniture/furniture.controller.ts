import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import { Role, UserRole } from "@/core/domain/roles";
import {
  PermissionAction,
  PermissionCollection,
} from "@/core/domain/permissions";
import {
  JwtAuthGuard,
  OptionalJwtAuthGuard,
} from "@/infrastructure/features/auth";
import { WrapperResponseDtoMapper } from "@/lib/responses";
import { SearchItemsParamsDto } from "@/infrastructure/http";
import { addConditionsToWhereClause } from "@/infrastructure/helpers";
import { ItemNotFoundException } from "@/core/domain/common/exceptions";
import { FilesInterceptor } from "@nestjs/platform-express";
import { IUserRepository } from "@/core/domain/users";
import { FurnitureStatus } from "@/core/domain/furniture";

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
    @CurrentUser("role") userRole: Role,
    @UploadedFiles() uploadedImages?: Express.Multer.File[],
  ) {
    this.logger.debug("Create furniture request", {
      lat: payload.lat,
      lng: payload.lng,
      position: payload.position,
      uploadedImagesCount: uploadedImages?.length ?? 0,
    });

    const isAdmin = Boolean(userRole?.hasAdminAccess());
    const status = isAdmin
      ? (payload.status ?? FurnitureStatus.Active)
      : FurnitureStatus.Inactive;

    const furniture = await this.commandBus.execute(
      new CreateFurnitureCommand({
        ...payload,
        status,
        metadata: {
          ...(payload?.metadata || {}),
          adminValidated: isAdmin,
          adminValidatedAt: isAdmin ? new Date().toISOString() : undefined,
        },
        ownerId: userId,
      }),
    );

    return this.responseMapper.mapFrom(furniture);
  }

  @ApiResponse({ type: WrapperResponseFurnitureBatchDto })
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async readMany(
    @Query() params: SearchItemsParamsDto,
    @CurrentUser("id") userId?: string,
    @CurrentUser("role") userRole?: Role,
  ) {
    const isProRole =
      userRole?.id === UserRole.ProEntreprise ||
      userRole?.id === UserRole.ProParticulier;
    const isAdmin = Boolean(userRole?.hasAdminAccess());

    // Keep endpoint unchanged for Flutter:
    // - Pro with token: only own furnitures
    // - Admin: all furnitures
    // - Public/no token: only active furnitures
    if (isProRole && userId && !isAdmin) {
      params._where = addConditionsToWhereClause(
        [{ _field: "owner.id", _op: "eq", _val: userId }],
        params._where,
      );
    } else if (!isAdmin) {
      params._where = addConditionsToWhereClause(
        [{ _field: "status", _op: "eq", _val: FurnitureStatus.Active }],
        params._where,
      );
    }

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
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @Get(":id")
  async readOne(
    @Param("id") id: string,
    @CurrentUser("id") userId?: string,
    @CurrentUser("role") userRole?: Role,
  ) {
    const furniture = await this.repository.findOne(id);
    if (!furniture) throw new ItemNotFoundException();

    const resolvedOwnerId = furniture.ownerId || furniture.owner;
    const isOwner = Boolean(userId && resolvedOwnerId === userId);
    const canSeeNonPublic = Boolean(userRole?.hasAdminAccess() || isOwner);

    // Prevent data leak: only owner/admin can access non-public furnitures.
    if (furniture.status !== FurnitureStatus.Active && !canSeeNonPublic)
      throw new ItemNotFoundException();

    // Keep previous behavior for active furnitures and owner/admin views.
    if (resolvedOwnerId && !furniture.ownerPhoneNumber)
      furniture.ownerPhoneNumber =
        await this.resolveOwnerPhoneNumber(resolvedOwnerId);
    if (!furniture.ownerPhoneNumber) furniture.ownerPhoneNumber = null;
    return this.responseMapper.mapFrom(furniture);
  }

  private async resolveOwnerPhoneNumber(
    ownerId: string,
  ): Promise<string | null> {
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
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
  ) {
    const existing = await this.repository.findOne(id);
    if (!existing) throw new ItemNotFoundException();

    const existingOwnerId = existing.ownerId || existing.owner;
    const isOwner = existingOwnerId === userId;
    const isAdmin = Boolean(userRole?.hasAdminAccess());

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException(
        "Vous ne pouvez modifier que vos propres meubles.",
      );
    }

    if (!isAdmin && payload.status) {
      if (
        payload.status !== FurnitureStatus.Active &&
        payload.status !== FurnitureStatus.Inactive
      ) {
        throw new ForbiddenException(
          "Le statut autorisé pour un pro est active ou inactive.",
        );
      }

      if (
        payload.status === FurnitureStatus.Active &&
        !existing.metadata?.adminValidated
      ) {
        throw new ForbiddenException(
          "Ce meuble doit d'abord être validé par un admin avant activation.",
        );
      }
    }

    const mergedMetadata = {
      ...(existing.metadata || {}),
      ...(payload.metadata || {}),
    };

    if (isAdmin && payload.status === FurnitureStatus.Active) {
      mergedMetadata.adminValidated = true;
      mergedMetadata.adminValidatedAt =
        mergedMetadata.adminValidatedAt || new Date().toISOString();
    }

    await this.repository.updateOne(id, {
      ...payload,
      metadata: mergedMetadata,
    } as any);
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
  async delete(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
  ) {
    const existing = await this.repository.findOne(id);
    if (!existing) throw new ItemNotFoundException();

    const existingOwnerId = existing.ownerId || existing.owner;
    const isOwner = existingOwnerId === userId;
    const isAdmin = Boolean(userRole?.hasAdminAccess());
    if (!isAdmin && !isOwner) {
      throw new ForbiddenException(
        "Vous ne pouvez supprimer que vos propres meubles.",
      );
    }

    await this.repository.deleteOne(id);
    return { message: "Furniture deleted successfully" };
  }
}
