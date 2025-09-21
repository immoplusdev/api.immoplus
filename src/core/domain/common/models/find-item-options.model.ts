export type FindItemOptions<Model = any, KeyType = string> = {
  fields?: KeyType[];
  loadRelationIds?: boolean;
  relations?: RepositoryRelations;
  withDeleted?: boolean;
};

export type RepositoryRelations = string | string[] | Record<string, boolean>;
