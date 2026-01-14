import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";

export class BroadcastNotificationResponseDto {
  @ApiProperty({
    description: "Total number of users targeted for the broadcast",
    example: 1523,
  })
  totalTargeted: number;

  @ApiProperty({
    description: "Number of notifications successfully sent",
    example: 1518,
  })
  successful: number;

  @ApiProperty({
    description: "Number of notifications that failed to send",
    example: 5,
  })
  failed: number;

  @ApiProperty({
    required: false,
    description: "List of errors that occurred during sending",
    type: "array",
    items: {
      type: "object",
      properties: {
        userId: { type: "string" },
        error: { type: "string" },
      },
    },
    example: [{ userId: "uuid-123", error: "Invalid external user ID" }],
  })
  errors?: Array<{ userId: string; error: string }>;

  @ApiProperty({
    description: "Timestamp of when the broadcast was executed",
    example: "2024-01-07T12:30:00Z",
  })
  timestamp: Date;

  constructor(data?: OmitMethods<BroadcastNotificationResponseDto>) {
    if (data) Object.assign(this, data);
  }
}

export class WrapperResponseBroadcastNotificationDto extends WrapperResponseDto<BroadcastNotificationResponseDto> {
  @ApiProperty({ type: BroadcastNotificationResponseDto })
  data: BroadcastNotificationResponseDto;
}
