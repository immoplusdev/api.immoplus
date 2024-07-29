import { ItemsOperator, ItemsParamsCriterias, ItemsParamsCriteriasLogic, SearchItemsParams } from "@/core/domain/http";
import { InvalidQueryException } from "@/core/domain/shared/exceptions";
import { ItemsParamsCriteriasDto } from "src/infrastructure/http/dto";
import { And, Equal, Like, Or, Not, MoreThan, MoreThanOrEqual, LessThan, LessThanOrEqual, In } from "typeorm";

export function parseHttpQuery(query: any): SearchItemsParams {
  const params: SearchItemsParams = {};
  if (query._page) params._page = query._page;
  if (query._per_page) params._per_page = query._per_page;
  if (query._order_by) params._order_by = query._order_by;
  if (query._order_dir) params._order_dir = query._order_dir;
  if (query._select) query.select = query._select.split(",");

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

export function mapQueryToTypeormQuery(query: SearchItemsParams) {

  const whereConditions = query._where ? mapToTypeormWhere(query._where) : undefined;

  const searchParams = {
    where: whereConditions,
    skip: query._page ? (query._page - 1) * query._per_page : undefined,
    take: query._per_page,
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
  // TODO: Implement filter later;
  return {};

  // const filter = {};
  // if(criterias.length == 0) return filter;
  //
  // const operator = getOperator(criterias[0]._op, );
  // for (const criteria of criterias) {
  //    = getLOperator(criteria._l_op, getOperator(criteria._op, criteria._val));
  // }
  //
  // if(criterias.length != 0) filter[criteria._field] = getOperator(criteria._op, criteria._val);
  // return filter;
}

function getLOperator(lOperator: ItemsParamsCriteriasLogic, value: any): any {
  switch (lOperator) {
    case "and":
      return And(value);
    case "or":
      return Or(value);
    default:
      return And(value);
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
      return Like(value);
    case "ncontains":
      return Not(Like(value));
    default:
      return Like(value);
  }
}

function transformWhereCriterias(criterias: string): ItemsParamsCriteriasDto {
  return JSON.parse(criterias);
}
