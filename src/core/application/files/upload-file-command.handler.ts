import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UploadFileCommand } from "./upload-file.command";
import { UploadFileCommandResponse } from "./upload-file-command.response";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { FileData, FileStorage, IFileRepository } from "@/core/domain/files";

@CommandHandler(UploadFileCommand)
export class UploadFileCommandHandler
  implements ICommandHandler<UploadFileCommand>
{
  constructor(
    @Inject(Deps.FileRepository)
    private readonly fileRepository: IFileRepository,
  ) {}

  async execute(
    command: UploadFileCommand,
  ): Promise<UploadFileCommandResponse> {
    const payload: Partial<FileData> = {
      type: command?.file?.mimetype,
      title: command?.title,
      folder: command?.folder,
      storage: FileStorage.Minio,
      description: command?.description,
      fileSize: command?.file?.size,
      externalFileId: command?.externalFileId?.split(".")[0],
      fileNameDisk: command?.file?.originalname,
      fileNameDownload: command?.externalFileId,
      uploadedBy: command.userId || null,
    };

    return await this.fileRepository.createOne(payload, true);
  }
}
