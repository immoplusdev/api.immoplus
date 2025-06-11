export interface SearchItemsParams {
  _page?: number;
  _per_page?: number;
  _order_by?: string;
  _order_dir?: ItemsParamsOrderDirection;
  _where?: ItemsParamsCriterias[];
  _select?: string[];
  _search?: string;
}

export interface SearchGeolocalizedItemsParams {
  _lat: number
  _long: number;
  _radius?: number;
  _start_date?: Date;
  _end_date?: Date;
  _page?: number;
  _per_page?: number;
  _order_by?: string;
  _order_dir?: ItemsParamsOrderDirection;
  _where?: ItemsParamsCriterias[];
  _select?: string[];
  _search?: string;
}


export interface SelectItemsParams {
  _select?: string[];
}

export type ItemsParamsOrderDirection = "asc" | "desc";

export interface ItemsParamsCriterias {
  _field: string;
  _op?: ItemsOperator;
  _val?: string | string[];
  _l_op?: ItemsParamsCriteriasLogic;
}

export type ItemsParamsCriteriasLogic = "and" | "or";

export type ItemsOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "in"
  | "nin"
  | "contains"
  | "ncontains"
  | "like"
// | 'startswith'
// | 'endswith'
// | 'isnull'
// | 'isnotnull'
// | 'isempty'
// | 'isnotempty';
