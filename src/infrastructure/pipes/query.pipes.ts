import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";
import { SearchItemsParams } from "@/core/domain/http";
import { ItemsParamsCriteriasDto, parseHttpQuery } from "@/infrastructure/http";

@Injectable()
export class QueryPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    // Make sure to only run your logic on queries
    if (type === "query") return this.transformQuery(value);

    return value;
  }

  transformQuery(query: any) {

    if (typeof query !== "object") return {};

    return parseHttpQuery(query);
  }


  transformWhereCriterias(criterias: string): ItemsParamsCriteriasDto {
    return JSON.parse(criterias);
  }
}
