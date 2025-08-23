import { DataSource } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { Payment, IPaymentRepository } from "@/core/domain/payments";

import {
  PaymentEntity,
  PaymentEntityMapper,
} from "@/infrastructure/features/payments";
import { BaseRepository } from "@/infrastructure/typeorm";
import { SearchItemsParams } from "@/core/domain/http";
import { FindItemOptions, WrapperResponse } from "@/core/domain/common/models";

@Injectable()
export class PaymentRepository implements IPaymentRepository {
  private readonly repository: BaseRepository<Payment>;
  private readonly relations = ["customer"];
  private readonly fullTextSearchFields: string[] = [
    "id",
    "amount",
    "amountNoFees",
    "customer",
    "paymentType",
    "collection",
    "paymentStatus",
    "paymentMethod",
    "itemId",
    "paymentAddress",
    "createdAt",
    "updatedAt",
    "deletedAt",
    "createdBy",
  ];

  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = new BaseRepository(
      dataSource,
      PaymentEntity,
      this.relations,
    )
      .setEntityMapper(new PaymentEntityMapper())
      .setFullTextSearchFields(this.fullTextSearchFields);
  }

  async createMany(payload: Partial<Payment>[]): Promise<Payment[]> {
    return await this.repository.createMany(payload);
  }

  async createOne(payload: Partial<Payment>): Promise<Payment> {
    return await this.repository.createOne(payload);
  }

  async findByQuery(
    query?: SearchItemsParams,
  ): Promise<WrapperResponse<Payment[]>> {
    return await this.repository.findByQuery(query);
  }

  async findOne(id: string, options?: FindItemOptions): Promise<Payment> {
    return this.repository.findOne(id, options);
  }

  async findOneByQuery(
    query?: SearchItemsParams,
    options?: FindItemOptions,
  ): Promise<Payment> {
    return this.repository.findOneByQuery(query, options);
  }

  async updateByQuery(
    query: SearchItemsParams,
    payload: Partial<Payment>,
  ): Promise<string[]> {
    return await this.repository.updateByQuery(query, payload);
  }

  async updateOne(id: string, payload: Partial<Payment>): Promise<string> {
    return await this.repository.updateOne(id, payload);
  }

  async deleteByQuery(query: SearchItemsParams): Promise<string[]> {
    return await this.repository.deleteByQuery(query);
  }

  async deleteOne(id: string): Promise<string> {
    return await this.repository.deleteOne(id);
  }
}
