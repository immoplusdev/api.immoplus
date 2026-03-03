import { Deps } from "@/core/domain/common/ioc";
import { ITransferRepository } from "@/core/domain/transfers/i-transfer.repository";
import { Transfer } from "@/core/domain/transfers/transfer.model";
import { Inject } from "@nestjs/common";
import { SearchItemsParams } from "@/core/domain/http";
import { FindItemOptions, WrapperResponse } from "@/core/domain/common/models";
import { BaseRepository } from "@/infrastructure/typeorm";
import { DataSource } from "typeorm";
import { TransfersEntity } from "./transfers.entity";

export class TransfersRepository implements ITransferRepository {
  private readonly relations = ["customer"];
  private readonly repository: BaseRepository<Transfer>;

  constructor(@Inject(Deps.DataSource) readonly dataSource: DataSource) {
    this.repository = new BaseRepository(
      dataSource,
      TransfersEntity,
      this.relations,
    ).setLoadRelationIds(false);
  }

  async createMany(payload: Partial<Transfer>[]): Promise<Transfer[]> {
    return await this.repository.createMany(payload);
  }

  async createOne(payload: Partial<Transfer>): Promise<Transfer> {
    return await this.repository.createOne(payload);
  }

  async findByQuery(
    query?: SearchItemsParams,
  ): Promise<WrapperResponse<Transfer[]>> {
    return await this.repository.findByQuery(query);
  }

  async findOne(id: string, options?: FindItemOptions): Promise<Transfer> {
    return await this.repository.findOne(id, options);
  }

  findOneByQuery(
    query?: SearchItemsParams,
    options?: FindItemOptions,
  ): Promise<Transfer> {
    return this.repository.findOneByQuery(query, options);
  }

  async updateOne(id: string, payload: Partial<Transfer>): Promise<string> {
    return await this.repository.updateOne(id, payload);
  }

  async updateByQuery(
    query: SearchItemsParams,
    payload: Partial<Transfer>,
  ): Promise<string[]> {
    return this.repository.updateByQuery(query, payload);
  }

  async deleteByQuery(query: SearchItemsParams): Promise<string[]> {
    return await this.repository.deleteByQuery(query);
  }

  async deleteOne(id: string): Promise<string> {
    return await this.repository.deleteOne(id);
  }
}
