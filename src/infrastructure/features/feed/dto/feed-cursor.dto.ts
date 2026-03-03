import { ApiProperty } from "@/core/domain/common/docs";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Type } from "class-transformer";

export class FeedCursorQueryDto {
  @ApiProperty({
    required: false,
    description: "Base64-encoded cursor from previous response",
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiProperty({
    required: false,
    description: "Filter by property (parent) UUID",
  })
  @IsOptional()
  @IsString()
  property_id?: string;
}

export interface FeedCursorPayload {
  lastId: string;
  lastCreatedAt: string;
}

export function encodeCursor(payload: FeedCursorPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export function decodeCursor(cursor: string): FeedCursorPayload {
  return JSON.parse(Buffer.from(cursor, "base64").toString("utf8"));
}
