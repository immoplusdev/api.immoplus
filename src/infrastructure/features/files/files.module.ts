import { Module, Provider } from '@nestjs/common';
import { Deps } from '@/core/domain/shared/ioc';
import { FileController } from './files.controller';
import { FileRepository } from './files.repository';
import { TypeormModule } from "@/infrastructure/typeorm";
import { UploadFileCommandHandler } from "@/core/application/features/files";
import { CqrsModule } from "@nestjs/cqrs";
import { ConfigsModule } from "@/infrastructure/features/configs/configs.module";

const commandHandlers = [UploadFileCommandHandler];

const providers: Provider[] = [
  {
    provide: Deps.FileRepository,
    useClass: FileRepository,
  },
];

@Module({
  controllers: [FileController],
  imports: [TypeormModule, CqrsModule, ConfigsModule],
  providers: [...providers, ...commandHandlers],
  exports: [...providers],
})
export class FileModule {}
