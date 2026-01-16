/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Inject,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
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
import { WrapperResponseDtoMapper } from "@/lib/responses";
import {
  FileDtoMapper,
  MulterFile,
  UploadFileCommandDto,
  WrapperResponseFileDto,
  WrapperResponseFileListDto,
} from "@/infrastructure/features/files";
import { Role, UserRole } from "@/core/domain/roles";
import {
  PermissionAction,
  PermissionCollection,
} from "@/core/domain/permissions";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadFileCommand } from "@/core/application/files";
import {
  UploadFileCommandResponseDto,
  WrapperResponseUploadFileCommandResponseDto,
} from "@/infrastructure/features/files/dto/upload-file-command-response.dto";
import { CommandBus } from "@nestjs/cqrs";
import {
  CurrentUser,
  OwnerAccessRequired,
  RequiredPermissions,
  RequiredRoles,
} from "@/infrastructure/decorators";
import { addConditionsToWhereClause, hasFileExtension } from "@/infrastructure/helpers";
import { Deps } from "@/core/domain/common/ioc";
import { FileStorage, IFileRepository } from "@/core/domain/files";
import {
  SearchItemsParamsDto,
  SelectItemsParamsDto,
} from "@/infrastructure/http";
import { JwtAuthGuard } from "@/infrastructure/features/auth";
import { Response } from "express";
import { randomUUID } from "crypto";
import { FilesService } from "./file-service";
import axios from "axios";

@ApiTags("File")
@Controller("files")
export class FileController {
  private readonly dtoMapper = new FileDtoMapper();
  private readonly responseMapper = new WrapperResponseDtoMapper(
    this.dtoMapper,
  );

  constructor(
    readonly commandBus: CommandBus,
    @Inject(Deps.FileRepository)
    private readonly repository: IFileRepository,
    @Inject(Deps.FileService)
    readonly service: FilesService,
  ) { }

  @ApiResponse({
    type: WrapperResponseUploadFileCommandResponseDto,
  })
  @Post()
  @RequiredRoles(
    UserRole.Admin,
    UserRole.Customer,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([PermissionCollection.Files, PermissionAction.Create])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        folder: { type: "string" },
        description: { type: "string" },
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor("file"))
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000 }),
          // new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @CurrentUser("id") userId: string,
    @Body() payload: UploadFileCommandDto,
  ) {
    const responseMapper =
      new WrapperResponseDtoMapper<UploadFileCommandResponseDto>();

    const fileExtension = file.originalname.split('.').pop();
    const uploadedFile: MulterFile = {
      ...file,
      externalFileId: `${randomUUID()}.${fileExtension}`,
    };

    await this.service.uploadFile(uploadedFile);

    const command = new UploadFileCommand({
      ...payload,
      userId,
      file: file as never,
      externalFileId: uploadedFile.externalFileId,
    });

    const response = await this.commandBus.execute(command);

    return responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseUploadFileCommandResponseDto,
  })
  @Post("public")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        folder: { type: "string" },
        description: { type: "string" },
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor("file"))
  async createPublic(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 10000 }),
          // new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() payload: UploadFileCommandDto,
  ) {
    const responseMapper =
      new WrapperResponseDtoMapper<UploadFileCommandResponseDto>();

    console.log("Starting upload");
    const fileExtension = file.originalname.split('.').pop();
    const uploadedFile: MulterFile = {
      ...file,
      externalFileId: `${randomUUID()}.${fileExtension}`,
    };

    await this.service.uploadFile(uploadedFile);

    console.log("Uploaded");

    const command = new UploadFileCommand({
      ...payload,
      userId: null,
      file: file as never,
      externalFileId: uploadedFile.externalFileId,
    });

    const response = await this.commandBus.execute(command);

    console.log("Record saved");

    return responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponseFileListDto,
  })
  @RequiredRoles(
    UserRole.Admin,
    UserRole.Customer,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([PermissionCollection.Files, PermissionAction.Read])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @OwnerAccessRequired("uploadedBy")
  @Get()
  async readMany(
    @Query() params: SearchItemsParamsDto,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
  ) {
    if (!userRole.hasAdminAccess())
      params._where = addConditionsToWhereClause(
        [
          {
            _field: "uploadedBy",
            _l_op: "and",
            _val: userId,
          },
        ],
        params._where,
      );

    const items = await this.repository.findByQuery(params);

    return this.responseMapper.mapFromQueryResult(items);
  }

  @ApiResponse({
    type: WrapperResponseFileDto,
  })
  @RequiredRoles(
    UserRole.Admin,
    UserRole.Customer,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([PermissionCollection.Files, PermissionAction.Read])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @OwnerAccessRequired("uploadedBy")
  @Get(":id")
  async readOne(
    @Param("id") id: string,
    @Query() params?: SelectItemsParamsDto,
  ) {
    const item = await this.repository.findOne(id, { fields: params?._select });

    return this.responseMapper.mapFrom(item);
  }

  @RequiredRoles(
    UserRole.Admin,
    UserRole.Customer,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([PermissionCollection.Files, PermissionAction.Read])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("raw/:id")
  async getRawFile(
    @Param("id") id: string,
    @Res() res: Response,
  ): Promise<any> {
    const file = await this.repository.findOne(id.split(".")[0]);
    if (!file) return null;

    const url = await this.service.getFile(
      file.storage == FileStorage.Minio
        ? file.fileNameDownload
        : file.externalFileId,
    );
    return res.redirect(url);
  }

  @Get("raw/public/:id")
  async getRawPublicFile(
    @Param("id") id: string,
    @Res() res: Response,
  ): Promise<any> {
    const file = await this.repository.findOne(id.split(".")[0]);
    if (!file) return res.send(null);

    const url = await this.service.getFile(
      file.storage == FileStorage.Minio
        ? file.fileNameDownload
        : file.externalFileId,
    );
    return res.redirect(url);
  }

  @Get("videos/raw/public/:id")
  @Header("Content-Type", "video/mp4")
  async getRawPublicVideo(
    @Param("id") id: string,
    @Res() res: Response,
  ): Promise<any> {
    const file = await this.repository.findOne(id.split(".")[0]);
    if (!file) return res.send(null);

    // Generate ETag based on file ID and updated date for caching
    const etag = `"${file.id}-${file.updatedAt?.getTime() || file.createdAt?.getTime()}"`;

    // Check if client has cached version
    const clientEtag = res.req.headers['if-none-match'];
    if (clientEtag === etag) {
      return res.status(304).send();
    }

    const url = await this.service.getFile(
      file.storage == FileStorage.Minio
        ? file.fileNameDownload
        : file.externalFileId,
      "video"
    );

    console.log("url => ", url);
    if (hasFileExtension(url)) return res.redirect(url);
    // return res.redirect(url);
    const response = await axios.get(url, { responseType: 'stream' });

    res.setHeader('Content-Type', 'video/mp4');
    if (response.headers['content-length']) {
      res.setHeader('Content-Length', response.headers['content-length']);
    }

    // Add caching headers
    res.setHeader('ETag', etag);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // Cache for 1 year
    res.setHeader('Accept-Ranges', 'bytes'); // Enable range requests for video seeking

    return response.data.pipe(res);
  }

  @ApiResponse({
    type: WrapperResponseFileDto,
  })
  @RequiredRoles(
    UserRole.Admin,
    UserRole.Customer,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([PermissionCollection.Files, PermissionAction.Update])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() payload: UploadFileCommandDto,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
  ) {
    const query = {
      _where: [
        {
          _field: "id",
          _val: id,
        },
      ],
    };

    if (!userRole.hasAdminAccess())
      query._where.push({ _field: "uploadedBy", _val: userId });

    await this.repository.updateByQuery(query, payload);

    return this.responseMapper.mapFrom(
      (await this.repository.findByQuery(query)).data.at(0),
    );
  }

  @ApiResponse({
    type: WrapperResponseFileDto,
  })
  @RequiredRoles(
    UserRole.Admin,
    UserRole.Customer,
    UserRole.ProEntreprise,
    UserRole.ProParticulier,
  )
  @RequiredPermissions([PermissionCollection.Files, PermissionAction.Delete])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(":id")
  async delete(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
  ) {
    const query = {
      _where: [
        {
          _field: "id",
          _val: id,
        },
      ],
    };

    if (!userRole.hasAdminAccess())
      query._where.push({ _field: "createdBy", _val: userId });

    await this.repository.deleteByQuery(query);

    return this.responseMapper.mapFrom({ id } as never);
  }
}
