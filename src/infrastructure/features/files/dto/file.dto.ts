import { OmitMethods } from "@/lib/ts-utilities";
import { FileStorage } from "@/core/domain/files";
import { ApiProperty } from "@/core/domain/common/docs";
import { WrapperResponseDto } from "@/lib/responses";

export interface MulterFile extends Express.Multer.File {
  externalFileId: string;
}


export class FileDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  fileNameDisk: string;
  @ApiProperty()
  title?: string;
  @ApiProperty()
  fileNameDownload?: string;
  @ApiProperty({ enum: FileStorage })
  storage?: FileStorage;
  @ApiProperty()
  externalFileId?: string;
  @ApiProperty()
  type?: string;
  @ApiProperty()
  folder?: string;

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
