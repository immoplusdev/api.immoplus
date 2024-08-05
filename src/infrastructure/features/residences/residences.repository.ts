import { DataSource, Repository } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { Residence, IResidenceRepository } from "@/core/domain/residences";
import { ResidenceEntity } from "@/infrastructure/features/residences";
import { BaseRepository } from "@/infrastructure/typeorm";
import { SearchItemsParams } from "@/core/domain/http";
import { WrapperResponse } from "@/core/domain/shared/models";
import { mapQueryToTypeormQuery } from "@/infrastructure/http";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/infrastructure/configs";

@Injectable()
export class ResidenceRepository implements IResidenceRepository {
  private readonly repository: BaseRepository<Residence>;
  private readonly residenceRepository: Repository<ResidenceEntity>;

  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = new BaseRepository(dataSource, ResidenceEntity);
    this.residenceRepository = dataSource.getRepository(ResidenceEntity);
  }

  async createMany(payload: Partial<Residence>[]): Promise<Residence[]> {
    return await this.repository.createMany(payload);
  }

  async createOne(payload: Partial<Residence>): Promise<Residence> {
    return await this.repository.createOne(payload);
  }

  async findByQuery(query?: SearchItemsParams): Promise<WrapperResponse<Residence[]>> {
    if (query) {
      const typeormQuery = query ? mapQueryToTypeormQuery(query) : undefined;
      const [data, total] = await this.residenceRepository.findAndCount(typeormQuery);
      return new WrapperResponse(data).paginate({
        totalCount: total,
        currentPage: query?._page || DEFAULT_PAGE,
        pageSize: query?._per_page || DEFAULT_PAGE_SIZE,
      });
    } else {
      const [data, total] = await this.residenceRepository.findAndCount();
      return new WrapperResponse(data).paginate({
        totalCount: total,
        currentPage: query?._page || DEFAULT_PAGE,
        pageSize: query?._per_page || DEFAULT_PAGE_SIZE,
      });
    }
  }

  async findOne(id: string, fields?: string[]): Promise<Residence> {
    return await this.repository.findOne(id, fields);
  }

  async updateByQuery(query: SearchItemsParams, payload: Partial<Residence>): Promise<string[]> {
    return await this.repository.updateByQuery(query, payload);
  }

  async updateOne(id: string, payload: Partial<Residence>): Promise<string> {
    return await this.repository.updateOne(id, payload);
  }

  async deleteByQuery(query: SearchItemsParams): Promise<string[]> {
    return await this.repository.deleteByQuery(query);
  }

  async deleteOne(id: string): Promise<string> {
    return await this.repository.deleteOne(id);
  }
}
