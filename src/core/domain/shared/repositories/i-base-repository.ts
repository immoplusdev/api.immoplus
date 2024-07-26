import { SearchItemsParams } from "@/core/domain/http";

export interface IBaseRepository<
  Model,
  CreateDto = Model,
  UpdateDto = Model,
  KeyType = string,
> {
  create(payload: CreateDto): Promise<Model>;

  find(query?: SearchItemsParams): Promise<Model[]>;

  findOne(id: KeyType, fields?: []): Promise<Model>;

  update(id: KeyType, payload: UpdateDto): Promise<KeyType>;

  delete(id: KeyType): Promise<KeyType>;
}
