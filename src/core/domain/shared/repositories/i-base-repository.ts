export interface IBaseRepository<
  Model,
  CreateDto = Model,
  UpdateDto = Model,
  KeyType = string,
> {
  create(payload: CreateDto): Promise<Model>;

  findAll(): Promise<Model[]>;

  findOne(id: KeyType): Promise<Model>;

  update(id: KeyType, payload: UpdateDto): Promise<KeyType>;

  delete(id: KeyType): Promise<KeyType>;
}
