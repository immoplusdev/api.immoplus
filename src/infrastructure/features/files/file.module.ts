import { Module, Provider, forwardRef } from "@nestjs/common";
import { FileController } from "./file.controller";
import { FileRepository } from "./file.repository";
import { CqrsModule } from "@nestjs/cqrs";
import { FilesService } from "./file-service";
import { UploadFileCommandHandler } from "@/core/application/files";
import { Deps } from "@/core/domain/common/ioc";
import { TypeormModule } from "@/infrastructure/typeorm";
import { ConfigsModule } from "../configs";

const commandHandlers = [UploadFileCommandHandler];

const providers: Provider[] = [
  {
    provide: Deps.FileRepository,
    useClass: FileRepository,
  },
  {
    provide: Deps.FileService,
    useClass: FilesService,
  },
];

@Module({
  controllers: [FileController],
  imports: [CqrsModule, TypeormModule, forwardRef(() => ConfigsModule)],
  providers: [...providers, ...commandHandlers],
  exports: [...providers],
})
export class FileModule {}
