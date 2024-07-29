import { OmitMethods } from "@/lib/ts-utilities";
import { WrapperResponseDto } from "@/lib/responses";
import { ApiProperty } from "@nestjs/swagger";
import { FileDto } from "@/infrastructure/features/files";

export class UploadFileCommandResponseDto extends FileDto {
  constructor(data?: OmitMethods<UploadFileCommandResponseDto>) {
    if (data) super(data);
  }
}

export class WrapperResponseUploadFileCommandResponseDto extends WrapperResponseDto<UploadFileCommandResponseDto> {
  @ApiProperty({ type: UploadFileCommandResponseDto })
  data: UploadFileCommandResponseDto;
}

