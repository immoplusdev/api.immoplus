import { createReadStream } from "fs";
import {
  Body,
  Controller, Delete,
  Get,
  Inject,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query, StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from "@nestjs/swagger";
import { WrapperResponseDtoMapper } from "@/lib/responses";
import {
  FileDto,
  UploadFileCommandDto,
  WrapperResponseFileDto,
  WrapperResponseFileListDto,
} from "src/infrastructure/features/files/dto";
import { Role, UserRole } from "@/core/domain/roles";
import { PermissionAction, PermissionCollection } from "@/core/domain/permissions";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { fileUploadConfig } from "@/infrastructure/configs";
import { generateUuid } from "@/lib/ts-utilities/db";
import { UploadFileCommand } from "@/core/application/features/files";
import {
  UploadFileCommandResponseDto,
  WrapperResponseUploadFileCommandResponseDto,
} from "@/infrastructure/features/files/dto/upload-file-command-response.dto";
import { CommandBus } from "@nestjs/cqrs";
import { CurrentUser, RequiredPermissions, RequiredRoles } from "@/infrastructure/decorators";
import { JwtAuthGuard } from "src/infrastructure/auth/guards";
import { addConditionsToWhereClause, getFilePath } from "@/infrastructure/helpers";
import { Deps } from "@/core/domain/shared/ioc";
import { File, IFileRepository } from "@/core/domain/files";
import { ensureResourceListOwnership, ensureResourceOwnership } from "@/infrastructure/auth/helpers";
import { SearchItemsParamsDto } from "@/infrastructure/http";


@ApiTags("File")
@Controller("files")
export class FileController {
  constructor(
    readonly commandBus: CommandBus,
    @Inject(Deps.FileRepository)
    private readonly fileRepository: IFileRepository,
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
        destination: fileUploadConfig.uploadPath,
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
  @Get()
  async readMany(
    @Query() params: SearchItemsParamsDto,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
  ) {

    const responseMapper = new WrapperResponseDtoMapper<FileDto[]>();

    params._where = addConditionsToWhereClause([{
      _field: "uploadedBy",
      _l_op: "and",
      _val: userId,
    }], params._where);

    const files: File[] = await this.fileRepository.find(params);

    ensureResourceListOwnership(files, userId, "uploadedBy", userRole.id);

    return responseMapper.mapFrom(files);
  }

  @ApiResponse({
    type: WrapperResponseFileDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Files, PermissionAction.Read])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(":id")
  async readOne(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
  ) {

    const responseMapper = new WrapperResponseDtoMapper<FileDto>();

    const file = await this.fileRepository.findOne(id);

    ensureResourceOwnership(userId, file.uploadedBy, userRole.id);

    return responseMapper.mapFrom(file);
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
    const file = await this.fileRepository.findOne(id);
    const filePath = getFilePath(file.fileNameDisk);

    ensureResourceOwnership(userId, file.uploadedBy, userRole.id);

    const outputFile = createReadStream(filePath);
    return new StreamableFile(outputFile);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("raw/public/:id")
  async getRawPublicFile(
    @Param("id") id: string,
    @CurrentUser("role") userRole: Role,
  ): Promise<StreamableFile> {
    const file = await this.fileRepository.findOne(id);
    const filePath = getFilePath(file.fileNameDisk);

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

    const responseMapper = new WrapperResponseDtoMapper<FileDto>();

    const file = await this.fileRepository.findOne(id);

    ensureResourceOwnership(userId, file.uploadedBy, userRole.id);

    await this.fileRepository.update(id, payload);

    return responseMapper.mapFrom(await this.fileRepository.findOne(id));
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

    const responseMapper = new WrapperResponseDtoMapper<FileDto>();

    const file = await this.fileRepository.findOne(id);

    ensureResourceOwnership(userId, file.uploadedBy, userRole.id);

    await this.fileRepository.delete(id);

    return responseMapper.mapFrom(file);
  }
}

