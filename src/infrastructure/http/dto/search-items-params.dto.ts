import { ApiProperty } from '@nestjs/swagger';
/**
 * Search param data
 * @example `{ "_field": "champ", "_op": "eq", "_val": "valeur" }`
 */
export class ItemsParamsCriteriasDto {
  // @ApiProperty()
  _field: string;

  // @ApiProperty({
  //   enum: [
  //     'eq',
  //     'neq',
  //     'gt',
  //     'gte',
  //     'lt',
  //     'lte',
  //     'in',
  //     'nin',
  //     'contains',
  //     'ncontains',
  //     'startswith',
  //     'endswith',
  //     'isnull',
  //     'isnotnull',
  //     'isempty',
  //     'isnotempty',
  //   ],
  // })
  _op?: ItemsOperatorDto;

  // @ApiProperty()
  _val?: string;

  // @ApiProperty({
  //   enum: ['and', 'or'],
  // })
  _l_op?: ItemsParamsCriteriasDtoLogic;
}

export class SearchItemsParamsDto {
  @ApiProperty({ required: false })
  _page?: number;

  @ApiProperty({ required: false })
  _per_page?: number;

  @ApiProperty({ required: false })
  _order_by?: string;

  @ApiProperty({
    required: false,
    enum: ['asc', 'desc'],
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
}

export type ItemsParamsOrderDirectionDto = 'asc' | 'desc';

export type ItemsParamsCriteriasDtoLogic = 'and' | 'or';

export type ItemsOperatorDto =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'nin'
  | 'contains'
  | 'ncontains'
  // | 'startswith'
  // | 'endswith'
  // | 'isnull'
  // | 'isnotnull'
  // | 'isempty'
  // | 'isnotempty';
