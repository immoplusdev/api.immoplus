import { ApiProperty } from "@/core/domain/common/docs";
import { OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import { User } from "@/core/domain/users";

export class FileDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  fileNameDisk: string;
  @ApiProperty()
  title?: string;
  @ApiProperty()
  fileNameDownload?: string;
  @ApiProperty()
  storage?: string;
  @ApiProperty()
  type?: string;
  @ApiProperty()
  folder?: string;
  @ApiProperty()
  uploadedBy?: User | string;
  @ApiProperty()
  uploadedOn?: Date;
  @ApiProperty()
  modifiedBy?: User | string;
  @ApiProperty()
  modifiedOn?: Date;
  @ApiProperty()
  deletedOn?: Date;
  @ApiProperty()
  charset?: string;
  @ApiProperty()
  fileSize?: number;
  @ApiProperty()
  width?: number;
  @ApiProperty()
  height?: number;
  @ApiProperty()
  duration?: number;
  @ApiProperty()
  embed?: string;
  @ApiProperty()
  description?: string;
  @ApiProperty()
  location?: string;
  @ApiProperty()
  tags?: string;
  @ApiProperty()
  metadata?: Record<string, any>;
  @ApiProperty()
  focalPointX?: number;
  @ApiProperty()
  focalPointY?: number;
  @ApiProperty()
  tusId?: string;
  @ApiProperty()
  tusData?: Record<string, any>;
  constructor(data?: OmitMethods<FileDto>) {
    Object.assign(this, data);
  }
}

export class WrapperResponseFileDto extends WrapperResponseDto<FileDto> {
  @ApiProperty({ type: FileDto })
  data: FileDto;
}

export class WrapperResponseFileListDto extends WrapperResponseDto<FileDto[]> {
  @ApiProperty({ type: [FileDto] })
  data: FileDto[];
}
