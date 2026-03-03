import { DataSource } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { FeedVideo, IFeedVideoRepository } from "@/core/domain/feed";
import { FeedVideoEntity } from "./feed-video.entity";
import { BaseRepository } from "@/infrastructure/typeorm";
import { SearchItemsParams } from "@/core/domain/http";
import {
  FindItemOptions,
  RepositoryRelations,
  WrapperResponse,
} from "@/core/domain/common/models";
import { FeedVideoEntityMapper } from "./feed-video-entity.mapper";

@Injectable()
export class FeedVideoRepository implements IFeedVideoRepository {
  private readonly repository: BaseRepository<FeedVideo>;
  private readonly relations: RepositoryRelations = ["videoId", "createdBy"];

  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = new BaseRepository(
      dataSource,
      FeedVideoEntity,
      this.relations,
    ).setEntityMapper(new FeedVideoEntityMapper());
  }

  async createMany(
    payload: Partial<FeedVideo>[],
    returnPayload?: boolean,
  ): Promise<FeedVideo[]> {
    return await this.repository.createMany(payload, returnPayload);
  }

  async createOne(
    payload: Partial<FeedVideo>,
    returnPayload?: boolean,
  ): Promise<FeedVideo> {
    return await this.repository.createOne(payload, returnPayload);
  }

  async findByQuery(
    query?: SearchItemsParams,
    options?: FindItemOptions,
  ): Promise<WrapperResponse<FeedVideo[]>> {
    return await this.repository.findByQuery(query, options);
  }

  async findOne(id: string, options?: FindItemOptions): Promise<FeedVideo> {
    return await this.repository.findOne(id, options);
  }

  async findOneByQuery(
    query?: SearchItemsParams,
    options?: FindItemOptions,
  ): Promise<FeedVideo> {
    return await this.repository.findOneByQuery(query, options);
  }

  async updateByQuery(
    query: SearchItemsParams,
    payload: Partial<FeedVideo>,
  ): Promise<string[]> {
    return await this.repository.updateByQuery(query, payload);
  }

  async updateOne(id: string, payload: Partial<FeedVideo>): Promise<string> {
    return await this.repository.updateOne(id, payload);
  }

  async deleteByQuery(query: SearchItemsParams): Promise<string[]> {
    return await this.repository.deleteByQuery(query);
  }

  async deleteOne(id: string): Promise<string> {
    return await this.repository.deleteOne(id);
  }
}
