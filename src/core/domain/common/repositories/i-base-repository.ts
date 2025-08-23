import { SearchItemsParams } from "@/core/domain/http";
import { FindItemOptions, WrapperResponse } from "@/core/domain/common/models";

export interface IBaseRepository<
  Model,
  CreateDto = Partial<Model>,
  UpdateDto = Partial<Model>,
  KeyType = string,
> {
  // Create
  createMany(payload: CreateDto[], returnPayload?: boolean): Promise<Model[]>;

  createOne(payload: CreateDto, returnPayload?: boolean): Promise<Model>;

  // Read
  findByQuery(
    query?: SearchItemsParams,
    options?: FindItemOptions,
  ): Promise<WrapperResponse<Model[]>>;

  findOne(id: KeyType, options?: FindItemOptions): Promise<Model>;

  findOneByQuery(
    query?: SearchItemsParams,
    options?: FindItemOptions,
  ): Promise<Model>;

  // Update
  updateByQuery(
    query: SearchItemsParams,
    payload: UpdateDto,
  ): Promise<KeyType[]>;

  updateOne(id: KeyType, payload: UpdateDto): Promise<KeyType>;

  // Delete
  deleteByQuery(query: SearchItemsParams): Promise<KeyType[]>;

  deleteOne(id: KeyType): Promise<KeyType>;
}
