import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors, UploadedFile, ParseFilePipe, Get, Param, Inject, Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ApiResponse } from "@nestjs/swagger";
import { WrapperResponseDtoMapper } from "@/lib/responses";
import { FileDto, UploadFileCommandDto, WrapperResponseFileListDto } from "@/infrastructure/features/files/dtos";
import { UserRole } from "@/core/domain/roles";
import { PermissionAction, PermissionCollection } from "@/core/domain/permissions";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { fileUploadConfig } from "@/infrastructure/configs";
import { generateUuid } from "@/lib/ts-utilities/db";
import { UploadFileCommand } from "@/core/application/features/files";
import {
  UploadFileCommandResponseDto,
  WrapperResponseUploadFileCommandResponseDto,
} from "@/infrastructure/features/files/dtos/upload-file-command-response.dto";
import { CommandBus } from "@nestjs/cqrs";
import { CurrentUser, RequiredPermissions, RequiredRoles } from "@/infrastructure/decorators";
import { JwtAuthGuard } from "src/infrastructure/auth/guards";
import { addConditionsToWhereClause } from "@/infrastructure/helpers";
import { Deps } from "@/core/domain/shared/ioc";
import { IFileRepository } from "@/core/domain/files";
import { ensureResourceListOwnership } from "@/infrastructure/auth/helpers";
import { SearchItemsParamsDto } from "@/infrastructure/http";
import { File } from "@/core/domain/files";

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
        // outletId: { type: 'integer' },
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
  async createFile(
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
    type: WrapperResponseFileListDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Files, PermissionAction.Read])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(":id")
  async readMany(
    @Param("id") id: string,
    @Query() params: SearchItemsParamsDto,
    @CurrentUser("id") userId: string,
  ) {
    const responseMapper = new WrapperResponseDtoMapper<FileDto[]>();
    params._where = addConditionsToWhereClause([{
      _field: "uploadedBy",
      _l_op: "and",
      _val: userId,
    }], params._where);

    const files: File[] = await this.fileRepository.find(params);
    ensureResourceListOwnership(files, userId, "user");

    return responseMapper.mapFrom(files);
  }


//   @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
//   @RequiredPermissions([PermissionCollection.Files, PermissionAction.Read])
//   @UseGuards(JwtAuthGuard)
//   @ApiBearerAuth()
//   @Get("raw/:id")
//   async;
//
//   getRawFile(
//     @Param("id")
//       id: string,
//     @CurrentUser("id")
//       userId: string,
//   ):
//     Promise<StreamableFile> {
//     const file = await this.fileRepository.findOne(id);
//     const filePath = getFilePath(file.fileNameDisk);
//
//     ensureResourceOwnership(userId, file.uploadedBy,
//     );
//
//     const outputFile = createReadStream(filePath);
//     return new StreamableFile(outputFile);
//   }
//
//   @Get("raw/public/:id")
//   async getRawPublicFile(@Param("id")
//                            id: string;
//
// ):
//
//   Promise<StreamableFile> {
//     const file = await this.fileRepository.findOne(id);
//     const filePath = getFilePath(file.fileNameDisk);
//
//     const outputFile = createReadStream(filePath);
//     return new StreamableFile(outputFile);
//   }


}


// @RequiredRoles(RoleEnum.Tenant)
// @RequiredPermissions([PermissionEnum.User, ActionsEnum.Read])
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()