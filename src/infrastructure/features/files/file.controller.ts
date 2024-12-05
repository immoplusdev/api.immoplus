import { createReadStream } from "fs";
import {
  Body,
  Controller, Delete,
  Get, Header,
  Inject,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query, Res, StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from "@nestjs/swagger";
import { WrapperResponseDtoMapper } from "@/lib/responses";
import {
  FileDtoMapper,
  UploadFileCommandDto,
  WrapperResponseFileDto,
  WrapperResponseFileListDto,
} from "@/infrastructure/features/files";
import { Role, UserRole } from "@/core/domain/roles";
import { PermissionAction, PermissionCollection } from "@/core/domain/permissions";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { fileUploadConfig } from "@/infrastructure/configs/file-management/file-upload.config";
import { generateUuid } from "@/lib/ts-utilities/db";
import { UploadFileCommand } from "@/core/application/features/files";
import {
  UploadFileCommandResponseDto,
  WrapperResponseUploadFileCommandResponseDto,
} from "@/infrastructure/features/files/dto/upload-file-command-response.dto";
import { CommandBus } from "@nestjs/cqrs";
import { CurrentUser, OwnerAccessRequired, RequiredPermissions, RequiredRoles } from "@/infrastructure/decorators";
import { addConditionsToWhereClause, getFilePath } from "@/infrastructure/helpers";
import { Deps } from "@/core/domain/shared/ioc";
import { IFileRepository } from "@/core/domain/files";
import { SearchItemsParamsDto, SelectItemsParamsDto } from "@/infrastructure/http";
import { JwtAuthGuard } from "@/infrastructure/features/auth";


@ApiTags("File")
@Controller("files")
export class FileController {

  private readonly dtoMapper = new FileDtoMapper();
  private readonly responseMapper = new WrapperResponseDtoMapper(this.dtoMapper);

  constructor(
    readonly commandBus: CommandBus,
    @Inject(Deps.FileRepository)
    private readonly repository: IFileRepository,
  ) {
  }

  @ApiResponse({
    type: WrapperResponseUploadFileCommandResponseDto,
  })
  @Post()
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
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
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: fileUploadConfig?.uploadPath,
        filename: (req, file, cb) => {
          const fileNameSplit = file.originalname.split(".");
          const fileExt = fileNameSplit[fileNameSplit.length - 1];
          cb(null, `${generateUuid()}.${fileExt}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 10000 }),
          // new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
      file: Express.Multer.File,
    @CurrentUser("id") userId: string,
    @Body() payload: UploadFileCommandDto,
  ) {
    const responseMapper = new WrapperResponseDtoMapper<UploadFileCommandResponseDto>();
    const command = new UploadFileCommand({
      ...payload,
      userId,
      file,
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
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: fileUploadConfig.uploadPath,
        filename: (req, file, cb) => {
          const fileNameSplit = file.originalname.split(".");
          const fileExt = fileNameSplit[fileNameSplit.length - 1];
          cb(null, `${generateUuid()}.${fileExt}`);
        },
      }),
    }),
  )
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
    const responseMapper = new WrapperResponseDtoMapper<UploadFileCommandResponseDto>();
    const command = new UploadFileCommand({
      ...payload,
      userId: null,
      file,
    });

    const response = await this.commandBus.execute(command);
    return responseMapper.mapFrom(response);
  }


  @ApiResponse({
    type: WrapperResponseFileListDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
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

    if (!userRole.hasAdminAccess()) params._where = addConditionsToWhereClause([{
      _field: "uploadedBy",
      _l_op: "and",
      _val: userId,
    }], params._where);

    const items = await this.repository.findByQuery(params);

    return this.responseMapper.mapFromQueryResult(items);
  }

  @ApiResponse({
    type: WrapperResponseFileDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
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

  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Files, PermissionAction.Read])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("raw/:id")
  async getRawFile(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
  ):
    Promise<StreamableFile> {
    const file = await this.repository.findOne(id.split(".")[0]);
    if(!file) return null;

    const filePath = getFilePath(file?.fileNameDisk);
    const outputFile = createReadStream(filePath);
    return new StreamableFile(outputFile);
  }


  @Get("raw/public/:id")
  async getRawPublicFile(
    @Param("id") id: string,
  ): Promise<StreamableFile> {
    const file = await this.repository.findOne(id.split(".")[0]);
    if(!file) return null;


    const filePath = getFilePath(file?.fileNameDisk);
    const outputFile = createReadStream(filePath);
    return new StreamableFile(outputFile);
  }

  @Get("videos/raw/public/:id")
  @Header("Content-Type", "video/mp4")
  async getRawPublicVideo(
    @Param("id") id: string,
  ): Promise<StreamableFile> {
    const file = await this.repository.findOne(id.split(".")[0]);
    if(!file) return null;

    const filePath = getFilePath(file?.fileNameDisk);
    const outputFile = createReadStream(filePath);
    return new StreamableFile(outputFile);
  }


  @ApiResponse({
    type: WrapperResponseFileDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Files, PermissionAction.Update])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() payload: UploadFileCommandDto,
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

    if (!userRole.hasAdminAccess()) query._where.push({ _field: "uploadedBy", _val: userId });

    await this.repository.updateByQuery(query, payload);

    return this.responseMapper.mapFrom((await this.repository.findByQuery(query)).data.at(0));
  }

  @ApiResponse({
    type: WrapperResponseFileDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Files, PermissionAction.Delete])
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

