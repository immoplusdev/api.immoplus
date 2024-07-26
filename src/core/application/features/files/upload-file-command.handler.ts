import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UploadFileCommand } from "./upload-file.command";
import { UploadFileCommandResponse } from "./upload-file-command.response";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { IConfigsManagerService } from "@/core/domain/configs";
import { File, IFileRepository } from "@/core/domain/files";

@CommandHandler(UploadFileCommand)
export class UploadFileCommandHandler implements ICommandHandler<UploadFileCommand> {
  constructor(
    @Inject(Deps.ConfigsManagerService)
    private readonly configsManagerService: IConfigsManagerService,
    @Inject(Deps.FileRepository)
    private readonly fileRepository: IFileRepository,
  ) {
  }

  async execute(command: UploadFileCommand): Promise<UploadFileCommandResponse> {

    const fileUploadConfig = this.configsManagerService.getFileUploadConfigs();

    const payload: Partial<File> = {
      type: command.file.mimetype,
      title: command.title,
      folder: command.folder,
      storage: "local",
      description: command.description,
      fileSize: command.file.size,
      fileNameDisk: fileUploadConfig
        .parseName(command.file.path.replace(fileUploadConfig.uploadPath, ""))
        .replace("/", ""),
      fileNameDownload: fileUploadConfig
        .parseName(command.file.filename)
        .split(".")[0],
      uploadedBy: command.userId,
    };

    return await this.fileRepository.create(payload);
  }
}
