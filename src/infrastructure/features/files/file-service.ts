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
import { ForcedFileType } from "@/core/domain/files";

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

  async getFile(fileKey: string, forcedType?: ForcedFileType) {
    const additionalAttributes = forcedType
      ? this.getAwsFileTypeAttributes(forcedType)
      : {};

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      ...additionalAttributes,
    });
    console.log("command => ", command.input);

    return await getSignedUrl(this.s3Client, command, {
      expiresIn: 60 * 15,
    });
  }

  async getAwsFileTypeAttributes(forcedFileType: ForcedFileType) {
    switch (forcedFileType) {
      case "image":
        return {
          ResponseContentType: "image/png",
          ResponseContentDisposition: 'inline; filename="file.png"',
        };
      case "video":
        return {
          ResponseContentType: "video/mp4",
          ResponseContentDisposition: 'inline; filename="file.mp4"',
        };
      case "pdf":
        return {
          ResponseContentType: "application/pdf",
          ResponseContentDisposition: 'inline; filename="file.pdf"',
        };
      default:
        return {};
    }
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
