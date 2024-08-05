import { SearchItemsParams } from "@/core/domain/http";
import { WrapperResponse } from "@/core/domain/shared/models";

export interface IBaseRepository<
  Model,
  CreateDto = Partial<Model>,
  UpdateDto = Partial<Model>,
  KeyType = string,
> {
  createMany(payload: CreateDto[], returnPayload?: boolean): Promise<Model[]>;

  createOne(payload: CreateDto, returnPayload?: boolean): Promise<Model>;

  findByQuery(query?: SearchItemsParams): Promise<WrapperResponse<Model[]>>;

  findOne(id: KeyType, fields?: KeyType[]): Promise<Model>;

  updateByQuery(query: SearchItemsParams, payload: UpdateDto): Promise<KeyType[]>;

  updateOne(id: KeyType, payload: UpdateDto): Promise<KeyType>;

  deleteByQuery(query: SearchItemsParams): Promise<KeyType[]>;

  deleteOne(id: KeyType): Promise<KeyType>;
}

//TODO: edit plop controllers