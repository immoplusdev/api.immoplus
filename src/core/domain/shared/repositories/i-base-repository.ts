import { SearchItemsParams } from "@/core/domain/http";

export interface IBaseRepository<
  Model,
  CreateDto = Partial<Model>,
  UpdateDto = Partial<Model>,
  KeyType = string,
> {
  createMany(payload: CreateDto[]): Promise<Model[]>;

  createOne(payload: CreateDto): Promise<Model>;

  findByQuery(query?: SearchItemsParams): Promise<Model[]>;

  findOne(id: KeyType, fields?: KeyType[]): Promise<Model>;

  updateByQuery(query: SearchItemsParams, payload: UpdateDto): Promise<KeyType[]>;

  updateOne(id: KeyType, payload: UpdateDto): Promise<KeyType>;

  deleteByQuery(query: SearchItemsParams): Promise<KeyType[]>;

  deleteOne(id: KeyType): Promise<KeyType>;
}

//TODO: edit plop repository and Irepository
//TODO: edit plop controllers