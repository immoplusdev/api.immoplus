import { ItemsParamsCriteriasDto } from "@/infrastructure/http";

export function addConditionsToWhereClause(
  conditions: ItemsParamsCriteriasDto[],
  whereClause?: ItemsParamsCriteriasDto[],
): ItemsParamsCriteriasDto[] {
  return whereClause ? [...whereClause, ...conditions] : conditions;
}
