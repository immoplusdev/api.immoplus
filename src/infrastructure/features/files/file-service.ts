import { Injectable } from "@nestjs/common";
import {
  S3Client,
  ListBucketsCommand,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { InjectS3 } from "@/infrastructure/decorators";
import { MulterFile } from "@/infrastructure/features/files/dto";

@Injectable()
export class FilesService {
  protected bucketName = "files";

  constructor(@InjectS3() private readonly s3Client: S3Client) {}

  async bucketsList() {
    const command = new ListBucketsCommand({});
    const response = await this.s3Client.send(command);
    return response.Buckets || [];
  }

  async getFile(filename: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: filename,
    });
    // Generate presigned URL valid for 1 hour
    return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  async uploadFile(file: MulterFile) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: file.externalFileId,
      Body: file.buffer,
      ContentLength: file.size,
      ContentType: file.mimetype,
    });
    console.log("Uploading ... => ", command);

    const response = await this.s3Client.send(command);
    return response;
  }
}
