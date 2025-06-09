import { OmitMethods } from "@/lib/ts-utilities";
import { ApiProperty } from "@/core/domain/common/docs";
import { ItemsParamsCriteriasDto, ItemsParamsOrderDirectionDto } from "@/infrastructure/http";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";
import { truncate } from "fs";

export class GeolocalizedItemsSearchParamsQueryDto {
  @ApiProperty({ required: true, type: Number})
  lat: number;

  @ApiProperty({ required: true, type: Number })
  long: number;

  @ApiProperty({ required: false, type: Number})
  radius?: number;

  @ApiProperty({ required: false, type: Date})
  startDate?: Date;

  @ApiProperty({ required: false, type: Date})
  endDate?: Date;

  @ApiProperty({ required: false })
  _page?: number;

  @ApiProperty({ required: false })
  _per_page?: number;

  @ApiProperty({ required: false })
  _order_by?: string;

  @ApiProperty({
    required: false,
    enum: ["asc", "desc"],
    type: String
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

  
}
