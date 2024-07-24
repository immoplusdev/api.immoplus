import { InvalidQueryException } from '@/core/domain/exceptions/invalid-query.exception';
import { ItemsParamsCriteriasDto } from '@/infrastructure/swagger-adapter/search-item-params/search-items-params-dto';
import { SearchItemsParams } from '@/libs/utilities/search-items-params';
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class QueryPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    // Make sure to only run your logic on queries
    if (type === 'query') return this.transformQuery(value);

    return value;
  }

  transformQuery(query: any) {
    const params: SearchItemsParams = {};
    if (typeof query !== 'object') return params;

    if (
      !query._page &&
      !query._per_page &&
      !query._order_by &&
      !query._order_dir &&
      !query._where
    )
      return query;

    if (query._page) params._page = query._page;
    if (query._per_page) params._per_page = query._per_page;
    if (query._order_by) params._order_by = query._order_by;
    if (query._order_dir) params._order_dir = query._order_dir;
    if (query._where) {
      try {
        const stringCriterias: string[] =
          typeof query._where == 'object'
            ? query._where
            : ([query._where] as any);

        const whereCriterias = stringCriterias.map((stringCriteria) =>
          this.transformWhereCriterias(stringCriteria),
        );

        params._where = whereCriterias;
      } catch (error) {
        throw new InvalidQueryException();
      }
    }
    return params;
  }

  transformWhereCriterias(criterias: string): ItemsParamsCriteriasDto {
    return JSON.parse(criterias);
  }
}
