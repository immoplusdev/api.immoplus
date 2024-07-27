import { Repository } from "typeorm";
import { ItemsParamsCriterias, SearchItemsParams } from "@/core/domain/http";
import { InvalidQueryException } from "@/core/domain/shared/exceptions";
import { ItemsParamsCriteriasDto } from "@/infrastructure/http/dtos";

export function parseHttpQuery(query: any): SearchItemsParams {
  const params: SearchItemsParams = {};
  if (
    !query._page &&
    !query._per_page &&
    !query._order_by &&
    !query._order_dir &&
    !query._where &&
    !query._select
  )
    return query;

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

      const whereCriterias = stringCriterias.map((stringCriteria) =>
        transformWhereCriterias(stringCriteria),
      );

      params._where = whereCriterias;
    } catch (error) {
      throw new InvalidQueryException();
    }
  }
  return params;
}


export function mapQueryFieldsToTypeormFields(fields){
  return {};
}

export function mapQueryToTypeormQuery(query: SearchItemsParams): any {
  return {};
}

export function mapToTypeormWhere(criterias: ItemsParamsCriterias[]): any {
  return criterias.map(criteria => {
    const condition = {};
    condition[criteria._field] = { [criteria._op]: criteria._val };
    return condition;
  });
}

function transformWhereCriterias(criterias: string): ItemsParamsCriteriasDto {
  return JSON.parse(criterias);
}

export async function getFilteredItems<T>(query: any, repository: Repository<T>): Promise<T[]> {
  const searchParams = parseHttpQuery(query);
  const whereConditions = searchParams._where ? mapToTypeormWhere(searchParams._where) : {};

  return await repository.find({
    where: whereConditions,
    // order: searchParams._order_by ? { [searchParams._order_by]: searchParams._order_dir } : undefined,
    skip: searchParams._page ? (searchParams._page - 1) * searchParams._per_page : undefined,
    take: searchParams._per_page,
    // select: searchParams._select,
  });
}