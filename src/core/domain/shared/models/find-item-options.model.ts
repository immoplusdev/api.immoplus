export type FindItemOptions<Model = any, KeyType = string> = {
  fields?: KeyType[],
  loadRelationIds?: boolean,
  relations?: string | string[] | Record<string, boolean>,
}