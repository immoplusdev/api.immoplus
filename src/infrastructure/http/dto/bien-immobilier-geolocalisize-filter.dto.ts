
import { ApiProperty } from "@/core/domain/common/docs";
import { ItemsParamsCriteriasDto, ItemsParamsOrderDirectionDto } from "./search-items-params.dto";
export class BienImmobilierGeolocalisizeFilterDto {
    @ApiProperty({ required: false})
    _lat: number;
  
    @ApiProperty({ required: false})
    _long: number;
  
    @ApiProperty({ required: false})
    _radius?: number;
  
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