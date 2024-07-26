import { Repository } from "typeorm";
import { ItemsParamsCriterias, SearchItemsParams } from "@/core/domain/http";

export function parseHttpQuery(query: any): SearchItemsParams {
  return {
    _page: query._page,
    _per_page: query._per_page,
    _order_by: query._order_by,
    _order_dir: query._order_dir,
    _where: query._where ? JSON.parse(query._where) : undefined,
    _select: query._select ? query._select.split(",") : undefined,
  };
}

export function mapToTypeOrmWhere(criterias: ItemsParamsCriterias[]): any {
  return criterias.map(criteria => {
    const condition = {};
    condition[criteria._field] = { [criteria._op]: criteria._val };
    return condition;
  });
}

export async function getFilteredItems<T>(query: any, repository: Repository<T>): Promise<T[]> {
  const searchParams = parseHttpQuery(query);
  const whereConditions = searchParams._where ? mapToTypeOrmWhere(searchParams._where) : {};

  return await repository.find({
    where: whereConditions,
    // order: searchParams._order_by ? { [searchParams._order_by]: searchParams._order_dir } : undefined,
    skip: searchParams._page ? (searchParams._page - 1) * searchParams._per_page : undefined,
    take: searchParams._per_page,
    // select: searchParams._select,
  });
}