import { Inject, Injectable } from "@nestjs/common";
import {
  S3Client,
  ListBucketsCommand,
  PutObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
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

  /**
   * 
   * Modifier pour eviter ces erreurs:
      - Si file.buffer est undefined → crash

      - Si file.size est incorrect → erreur S3

      - Si externalFileId contient des caractères interdits → problème S3

      - Si le bucket n’existe pas → erreur runtime

      - Aucune protection contre des inputs malveillants
   */
  async uploadFile(file: MulterFile) {
    const body = this.ensureBuffer(file);
    const key = this.sanitizeS3Key(file.externalFileId);
    const bucket = this.getBucketName();
    const contentType = this.sanitizeContentType(file.mimetype);
    const contentLength = Number(file.size) || body.length;

    await this.ensureBucketExists(bucket);

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentLength: contentLength,
      ContentType: contentType,
    });

    const response = await this.s3Client.send(command);
    return response;
  }

  private async ensureBucketExists(bucket: string): Promise<void> {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: bucket }));
    } catch (err: unknown) {
      const e = err as {
        name?: string;
        $metadata?: { httpStatusCode?: number };
      };
      const isNotFound =
        e?.name === "NotFound" ||
        e?.name === "NoSuchBucket" ||
        e?.$metadata?.httpStatusCode === 404;
      if (isNotFound) {
        await this.s3Client.send(new CreateBucketCommand({ Bucket: bucket }));
      } else {
        throw err;
      }
    }
  }

  private getBucketName(): string {
    const name = this.bucketName?.trim();
    if (name && !name.match(/^[a-f0-9-]{36}\.(mp4|mov|webm|jpg|jpeg|png)$/i)) {
      return name;
    }
    return this.configService.get<string>("AWS_S3_BUCKET_NAME") || "files";
  }

  private ensureBuffer(file: MulterFile): Buffer {
    const buf = file.buffer as unknown;
    if (Buffer.isBuffer(buf)) return buf;
    const bufLike = buf as { data?: number[] };
    if (bufLike?.data && Array.isArray(bufLike.data)) {
      return Buffer.from(bufLike.data);
    }
    if (typeof buf === "string") {
      return Buffer.from(buf, "utf-8");
    }
    throw new Error("Upload file: buffer manquant ou format invalide");
  }

  private sanitizeS3Key(key: string): string {
    if (!key || typeof key !== "string") {
      throw new Error("Upload file: externalFileId manquant");
    }
    return key.replace(/[^\w.\-/]/g, "_").slice(0, 255);
  }

  private sanitizeContentType(mimetype: string | undefined): string {
    if (!mimetype || typeof mimetype !== "string") {
      return "application/octet-stream";
    }
    const safe = mimetype.split(";")[0].trim().slice(0, 128);
    return safe || "application/octet-stream";
  }
}
