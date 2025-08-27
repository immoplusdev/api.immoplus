import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import * as Minio from "minio";
import { InjectMinio } from "@/infrastructure/decorators";
import { MulterFile } from "@/infrastructure/features/files/dto";

@Injectable()
export class FilesService {
  protected bucketName = "files";

  constructor(@InjectMinio() private readonly minioService: Minio.Client) {}

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
