import { ItemsOperator, ItemsParamsCriterias, ItemsParamsCriteriasLogic, SearchItemsParams } from "@/core/domain/http";
import { InvalidQueryException } from "@/core/domain/shared/exceptions";
import { ItemsParamsCriteriasDto } from "@/infrastructure/http";
import { And, Equal, Like, Or, Not, MoreThan, MoreThanOrEqual, LessThan, LessThanOrEqual, In } from "typeorm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/infrastructure/configs";
import { Contains } from "class-validator";

export function parseHttpQuery(query: any): SearchItemsParams {
  const params: SearchItemsParams = {};
  if (query._page) params._page = query._page;
  if (query._per_page) params._per_page = query._per_page;
  if (query._order_by) params._order_by = query._order_by;
  if (query._order_dir) params._order_dir = query._order_dir;
  if (query._search) params._search = query._search;
  if (query._select) params._select = typeof query._select == "string" ? query._select.split(",") : query._select;
  if (query._where) {
    try {
      const stringCriterias: string[] =
        typeof query._where == "object"
          ? query._where
          : ([query._where] as any);

      params._where = stringCriterias.map((stringCriteria) =>
        transformWhereCriterias(stringCriteria),
      );

    } catch (error) {
      throw new InvalidQueryException();
    }
  }
  return params;
}

export function mapQueryFieldsToTypeormSelection(fields?: any[]) {
  if (!fields) return undefined;
  const typeormSelectFields: Record<string, boolean> = {};
  for (const field of fields) {
    typeormSelectFields[field] = true;
  }
  return typeormSelectFields;
}

export function mapQueryToTypeormQuery(query: SearchItemsParams, fullTextSearchFields?: string[]) {

  let whereConditions: ItemsParamsCriterias[] = [];
  if (query._where) whereConditions = query._where;

  if (query._search && fullTextSearchFields) {
    fullTextSearchFields.forEach((field) => {
      whereConditions.push({
        _field: field,
        _op: "like",
        _val: query._search,
        _l_op: "or",
      });
    });
  }

  whereConditions = mapToTypeormWhere(whereConditions);


  const pageSize = !query._page || !query._per_page ? DEFAULT_PAGE_SIZE : parseInt(query._per_page as never);
  const currentPage = query._page ? parseInt(query._page as never) || DEFAULT_PAGE : DEFAULT_PAGE;
  const skip = currentPage - 1 > 0 ? (currentPage - 1) * pageSize : 0;

  const searchParams = {
    where: whereConditions,
    skip,
    take: pageSize,
    select: mapQueryFieldsToTypeormSelection(query._select),
    order: undefined,
  };

  if (query._order_by && query._order_dir) {
    const order = {};
    order[query._order_by] = query._order_dir;
    searchParams.order = order;
  }

  return searchParams;
}

export function mapToTypeormWhere(criterias: ItemsParamsCriterias[]): any {

  if (criterias.length == 0) return {};

  const filters = {};
  const typeormFilter = {};
  for (const criteria of criterias) {
    if (!filters[criteria._field]) filters[criteria._field] = {
      _l_op: criteria?._l_op || "and",
      _op: criteria?._op || "eq",
      filters: [],
    };
    filters[criteria._field].filters.push(getOperator(criteria._op, criteria._val));
  }

  for (const key of Object.keys(filters)) {
    typeormFilter[key] = getLOperator(filters[key]._l_op, filters[key].filters);
  }

  return typeormFilter;
}

function getLOperator(lOperator: ItemsParamsCriteriasLogic, value: any[]): any {
  switch (lOperator) {
    case "and":
      return And(...value);
    case "or":
      return Or(...value);
    default:
      return And(...value);
  }
}

function getOperator(operator: ItemsOperator, value: any): any {

  switch (operator) {
    case "eq":
      return Equal(value);
    case "neq":
      return Not(Equal(value));
    case "gt":
      return MoreThan(value);
    case "gte":
      return MoreThanOrEqual(value);
    case "lt":
      return LessThan(value);
    case "lte":
      return LessThanOrEqual(value);
    case "in":
      return In(value);
    case "nin":
      return In(Not(value));
    case "contains":
      return Contains(value);
    case "ncontains":
      return Not(Contains(value));
    case "like":
      return Like(`%${value}%`);
    default:
      return Equal(value);
  }
}

function transformWhereCriterias(criterias: string): ItemsParamsCriteriasDto {
  return JSON.parse(criterias);
}
