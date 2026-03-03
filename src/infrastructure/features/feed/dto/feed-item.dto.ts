import { ApiProperty } from "@/core/domain/common/docs";
import { FeedParentType, FeedVideoStatus } from "@/core/domain/feed";
import { OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";

export class FeedContentDto {
  @ApiProperty()
  title?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  price?: string;

  @ApiProperty()
  location?: string;
}

export class FeedStatsDto {
  @ApiProperty()
  likes: number;

  @ApiProperty()
  views: number;
}

export class FeedRelatedToDto {
  @ApiProperty({ enum: FeedParentType })
  entity: FeedParentType;

  @ApiProperty({ format: "uuid" })
  id: string;
}

export class FeedAuthorDto {
  @ApiProperty({ format: "uuid" })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  avatar?: string;
}

export class FeedItemDto {
  @ApiProperty({ format: "uuid" })
  id: string;

  @ApiProperty({ enum: ["post", "legacy"] })
  source: "post" | "legacy";

  @ApiProperty()
  videoUrl: string;

  @ApiProperty({ required: false })
  thumbnailUrl?: string;

  @ApiProperty({ enum: FeedVideoStatus, required: false })
  status?: FeedVideoStatus;

  @ApiProperty({ type: FeedContentDto })
  content: FeedContentDto;

  @ApiProperty({ type: FeedStatsDto })
  stats: FeedStatsDto;

  @ApiProperty({ type: FeedRelatedToDto })
  relatedTo: FeedRelatedToDto;

  @ApiProperty({ type: FeedAuthorDto })
  author?: FeedAuthorDto;

  @ApiProperty()
  createdAt?: Date;

  constructor(data?: OmitMethods<FeedItemDto>) {
    if (data) Object.assign(this, data);
  }
}

export class WrapperResponseFeedBatchDto extends WrapperResponseDto<
  FeedItemDto[]
> {
  @ApiProperty({ type: [FeedItemDto] })
  data: FeedItemDto[];
}
