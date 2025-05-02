export type FindItemOptions<Model = any, KeyType = string> = {
  fields?: KeyType[],
  loadRelationIds?: boolean,
  relations?: RepositoryRelations,
}

export type RepositoryRelations = string | string[] | Record<string, boolean>;