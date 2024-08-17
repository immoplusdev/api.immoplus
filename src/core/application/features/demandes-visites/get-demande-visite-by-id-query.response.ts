import { OmitMethods } from '@/lib/ts-utilities';
import { ApiProperty } from "@nestjs/swagger";
import { WrapperResponseDto } from "@/lib/responses";

export class GetDemandeVisiteByIdQueryResponse {
  constructor(data?: OmitMethods<GetDemandeVisiteByIdQueryResponse>) {
    if(data) Object.assign(this, data);
  }
}

export class WrapperResponseGetDemandeVisiteByIdQueryResponseDto extends WrapperResponseDto<GetDemandeVisiteByIdQueryResponse> {
  @ApiProperty({ type: GetDemandeVisiteByIdQueryResponse })
  data: GetDemandeVisiteByIdQueryResponse;
}