import { Query, QueryOptions } from "@/core/domain/shared/models/query.model";
import { PrimaryKey } from "@/core/domain/shared/models/global.model";
export abstract class ItemsServicePort<T> {
    abstract createOne(payload: Partial<T>): Promise<PrimaryKey>;
    abstract readOne(
      key: PrimaryKey,
      query?: Query,
      opts?: QueryOptions
    ): Promise<T>;
    abstract readByQuery(query: Query, opts?: QueryOptions): Promise<T[]>;
    abstract updateOne(key: PrimaryKey, data: Partial<T>): Promise<T>;
    abstract updateByQuery(
      query: Query,
      data: Partial<T>,
      opts?: QueryOptions
    ): Promise<void>;
    abstract deleteOne(key: PrimaryKey, opts?: QueryOptions): Promise<T>;
    abstract deleteByQuery(query: Query, opts?: QueryOptions): Promise<void>;
  }