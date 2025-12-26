import { Injectable } from "@nestjs/common";
import * as Minio from "minio";
import { InjectMinio } from "@/infrastructure/decorators";
import { MulterFile } from "@/infrastructure/features/files/dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FilesService {
  protected bucketName: string;

  constructor(
    @InjectMinio() private readonly minioService: Minio.Client,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.get("MINIO_BUCKET_NAME", "files");
  }

  async bucketsList() {
    return await this.minioService.listBuckets();
  }

  async getFile(filename: string) {
    return await this.minioService.presignedUrl(
      "GET",
      this.bucketName,
      filename,
    );
  }

  uploadFile(file: MulterFile) {
    return new Promise((resolve, reject) => {
      this.minioService.putObject(
        this.bucketName,
        file.externalFileId,
        file.buffer,
        file.size,
        (error, objInfo) => {
          if (error) {
            reject(error);
          } else {
            resolve(objInfo);
          }
        },
      );
    });
  }
}
