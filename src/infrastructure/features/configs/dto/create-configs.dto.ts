import { ApiProperty } from "@nestjs/swagger";
import { OmitMethods } from '@/lib/ts-utilities';

export class CreateConfigDto {
constructor(data?: OmitMethods<CreateConfigDto>) {
  Object.assign(this, data);
  }
}