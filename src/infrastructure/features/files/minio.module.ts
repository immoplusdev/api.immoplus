import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Minio from "minio";
import { MINIO_TOKEN } from "@/infrastructure/decorators";

@Global()
@Module({
  exports: [MINIO_TOKEN],
  providers: [
    {
      inject: [ConfigService],
      provide: MINIO_TOKEN,
      useFactory: async (
        configService: ConfigService,
      ): Promise<Minio.Client> => {
        return new Minio.Client({
          endPoint: configService.getOrThrow("MINIO_ENDPOINT"),
          port: +configService.getOrThrow("MINIO_PORT"),
          accessKey: configService.getOrThrow("MINIO_ACCESS_KEY"),
          secretKey: configService.getOrThrow("MINIO_SECRET_KEY"),
          useSSL: false,
        });
      },
    },
  ],
})
export class MinioModule {}
