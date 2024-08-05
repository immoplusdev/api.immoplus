import { DataSource, Equal, Repository } from "typeorm";
import { Inject, Injectable } from '@nestjs/common';
import { Deps } from '@/core/domain/shared/ioc';
import { Reservation, IReservationRepository } from "@/core/domain/reservations";
import { ReservationEntity } from '@/infrastructure/features/reservations';
import { BaseRepository } from "@/infrastructure/typeorm";
import { SearchItemsParams } from "@/core/domain/http";
import { WrapperResponse } from "@/core/domain/shared/models";
import { mapQueryToTypeormQuery } from "@/infrastructure/http";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/infrastructure/configs";

@Injectable()
export class ReservationRepository implements IReservationRepository{
  private readonly repository: BaseRepository<Reservation>;
  private readonly reservationRepository: Repository<ReservationEntity>;
  private readonly relations = ["residence"];

  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = new BaseRepository(dataSource, ReservationEntity);
    this.reservationRepository = dataSource.getRepository(ReservationEntity);
  }

  async createMany(payload: Partial<Reservation>[]): Promise<Reservation[]> {
    return await this.repository.createMany(payload);
  }

  async createOne(payload: Partial<Reservation>): Promise<Reservation> {
    return await this.repository.createOne(payload);
  }

  async findByQuery(query?: SearchItemsParams): Promise<WrapperResponse<Reservation[]>> {
    return await this.repository.findByQuery(query);
  }

  async findByResidenceOwnerId(ownerId: string, query?: SearchItemsParams): Promise<WrapperResponse<Reservation[]>> {
    const typeormQuery = query ? mapQueryToTypeormQuery(query) : { where: {} };

    typeormQuery.where = {
      residence: {
        proprietaire: Equal(ownerId),
      },
    };

    const [data, total] = await this.reservationRepository.findAndCount({
      ...typeormQuery,
      relations: this.relations,
    });
    return new WrapperResponse(data).paginate({
      totalCount: total,
      currentPage: query?._page || DEFAULT_PAGE,
      pageSize: query?._per_page || DEFAULT_PAGE_SIZE,
    });
  }


  async findOne(id: string, fields?: string[]): Promise<Reservation> {
    return await this.repository.findOne(id, fields);
  }

  async updateByQuery(query: SearchItemsParams, payload: Partial<Reservation>): Promise<string[]> {
    return await this.repository.updateByQuery(query, payload);
  }

  async updateOne(id: string, payload: Partial<Reservation>): Promise<string> {
    return await this.repository.updateOne(id, payload);
  }

  async deleteByQuery(query: SearchItemsParams): Promise<string[]> {
    return await this.repository.deleteByQuery(query);
  }

  async deleteOne(id: string): Promise<string> {
    return await this.repository.deleteOne(id);
  }
}
