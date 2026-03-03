import { ApiProperty } from "@/core/domain/common/docs";
import { FeedParentType } from "@/core/domain/feed";
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

export class UploadFeedVideoDto {
  @ApiProperty({ enum: FeedParentType })
  @IsEnum(FeedParentType)
  parentType: FeedParentType;

  @ApiProperty({ format: "uuid" })
  @IsUUID()
  parentId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  titre?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
