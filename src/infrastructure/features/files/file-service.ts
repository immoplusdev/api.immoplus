import { Inject, Injectable } from "@nestjs/common";
import {
  S3Client,
  ListBucketsCommand,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { InjectS3 } from "@/infrastructure/decorators";
import { MulterFile } from "@/infrastructure/features/files/dto";
import { ConfigService } from "@nestjs/config";
import { Deps } from "@/core/domain/common/ioc";
import { IConfigsManagerService } from "@/core/domain/configs";

@Injectable()
export class FilesService {
  protected bucketName: string;

  constructor(
    @InjectS3() private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
    @Inject(Deps.ConfigsManagerService)
    private readonly configsManagerService: IConfigsManagerService,
  ) {
    this.bucketName = this.configService.get<string>(
      "AWS_S3_BUCKET_NAME",
      "files",
    );
  }

  async bucketsList() {
    const command = new ListBucketsCommand({});
    const response = await this.s3Client.send(command);
    return response.Buckets || [];
  }

  async getFile(fileKey: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    return await getSignedUrl(this.s3Client, command, {
      expiresIn: 60 * 15,
    });
  }

  async uploadFile(file: MulterFile) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: file.externalFileId,
      Body: file.buffer,
      ContentLength: file.size,
      ContentType: file.mimetype,
    });

    const response = await this.s3Client.send(command);
    return response;
  }
}
