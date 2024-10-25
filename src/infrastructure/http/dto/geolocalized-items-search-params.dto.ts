import { OmitMethods } from "@/lib/ts-utilities";
import { IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ItemsParamsCriteriasDto, ItemsParamsOrderDirectionDto } from "@/infrastructure/http";

export class GeolocalizedItemsSearchParamsQueryDto {
  @ApiProperty()
  lat: number;

  @ApiProperty()
  long: number;

  @ApiProperty({ required: false })
  @IsOptional()
  radius: number;

  @ApiProperty({ required: false })
  _page?: number;

  @ApiProperty({ required: false })
  _per_page?: number;

  @ApiProperty({ required: false })
  _order_by?: string;

  @ApiProperty({
    required: false,
    enum: ["asc", "desc"],
  })
  _order_dir?: ItemsParamsOrderDirectionDto;

  @ApiProperty({
    required: false,
    isArray: true,
    type: String,
    default: [`{ "_field": "field", "_op": "eq", "_val": "value" }`],
  })
  _where?: [ItemsParamsCriteriasDto];

  @ApiProperty({
    required: false,
    isArray: true,
    type: String,
  })
  _select?: string[];

  @ApiProperty({
    required: false,
    type: String,
  })
  _search?: string;

  constructor(data?: OmitMethods<GeolocalizedItemsSearchParamsQueryDto>) {
    Object.assign(this, data);
  }
}
