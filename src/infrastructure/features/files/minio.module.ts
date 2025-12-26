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
          endPoint: "164.90.203.20",
          port: 9002,
          accessKey: "2Y2wGZNtdHRJR6XB",
          secretKey: "wpcgyLLrUgG2YxgKpObJswsTAUy8O4xf",
          useSSL: false,
        });
      },
    },
  ],
})
export class MinioModule {}
