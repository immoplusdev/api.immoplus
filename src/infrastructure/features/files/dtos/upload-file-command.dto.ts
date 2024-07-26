import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";

export class UploadFileCommandDto {
  constructor(data?: OmitMethods<UploadFileCommandDto>) {
    Object.assign(this, data);
  }
}
