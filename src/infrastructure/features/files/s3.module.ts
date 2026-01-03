import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3Client } from "@aws-sdk/client-s3";
import { S3_TOKEN } from "@/infrastructure/decorators";

@Global()
@Module({
  exports: [S3_TOKEN],
  providers: [
    {
      inject: [ConfigService],
      provide: S3_TOKEN,
      useFactory: async (configService: ConfigService): Promise<S3Client> => {
        return new S3Client({
          region: configService.getOrThrow("AWS_S3_REGION"),
          credentials: {
            accessKeyId: configService.getOrThrow("AWS_S3_ACCESS_KEY_ID"),
            secretAccessKey: configService.getOrThrow("AWS_S3_SECRET_ACCESS_KEY"),
          },
          // Optional: For S3-compatible services (like MinIO in S3 compatibility mode)
          ...(configService.get("AWS_S3_ENDPOINT")
            ? {
              endpoint: configService.get("AWS_S3_ENDPOINT"),
              forcePathStyle: false,
              tls: true
              // (configService.get("AWS_S3_FORCE_PATH_STYLE") || "false") ===
              // "true",
            }
            : {}),
        });
      },
    },
  ],
})
export class S3Module { }
