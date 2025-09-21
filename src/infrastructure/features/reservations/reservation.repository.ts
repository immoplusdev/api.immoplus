import { DataSource } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import {
  Reservation,
  IReservationRepository,
} from "@/core/domain/reservations";
import { ReservationEntity } from "@/infrastructure/features/reservations";
import { BaseRepository } from "@/infrastructure/typeorm";
import { ItemsParamsCriterias, SearchItemsParams } from "@/core/domain/http";
import { FindItemOptions, WrapperResponse } from "@/core/domain/common/models";
import { ReservationEntityMapper } from "@/infrastructure/features/reservations/reservation-entity.mapper";
import { IResidenceRepository } from "@/core/domain/residences";
import { EstimateReservationCostDto } from "@/core/application/reservations/estimate-reservation-cost.dto";
import { ItemNotFoundException } from "@/core/domain/common/exceptions";
import { calculateReservationPrice } from "@/core/application/reservations/reservation-price.helper";

@Injectable()
export class ReservationRepository implements IReservationRepository {
  private readonly repository: BaseRepository<Reservation>;
  private readonly relations = ["residence"];
  private readonly fullTextSearchFields: string[] = [
    "id",
    "residence",
    "statusReservation",
    "datesReservation",
    "statusFacture",
    "montantTotalReservation",
    "montantReservationSansCommission",
    "notes",
    "clientPhoneNumber",
    "createdAt",
    "updatedAt",
    "createdBy",
  ];

  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
    @Inject(Deps.ResidenceRepository)
    private readonly residenceRepository: IResidenceRepository,
  ) {
    this.repository = new BaseRepository(
      dataSource,
      ReservationEntity,
      this.relations,
    )
      .setEntityMapper(new ReservationEntityMapper())
      .setFullTextSearchFields(this.fullTextSearchFields);
  }

  async createMany(payload: Partial<Reservation>[]): Promise<Reservation[]> {
    return await this.repository.createMany(payload);
  }

  async createOne(payload: Partial<Reservation>): Promise<Reservation> {
    return await this.repository.createOne(payload);
  }

  async findByQuery(
    query?: SearchItemsParams,
  ): Promise<WrapperResponse<Reservation[]>> {
    return await this.repository.findByQuery(query);
  }

  async findByResidenceOwnerId(
    ownerId: string,
    query?: SearchItemsParams,
  ): Promise<WrapperResponse<Reservation[]>> {
    const idsResponse = await this.residenceRepository.findByQuery(
      {
        _where: [
          {
            _field: "proprietaire",
            _op: "eq",
            _val: ownerId,
          },
        ],
      },
      { fields: ["id"], relations: [] },
    );

    const idFilter: ItemsParamsCriterias = {
      _field: "residence",
      _op: "in",
      _val: idsResponse.data.map((item) => item.id),
    };

    const whereClause: ItemsParamsCriterias[] = query._where
      ? [...query._where, idFilter]
      : [idFilter];

    return await this.findByQuery({
      ...(query || {}),
      _where: whereClause,
    });
  }

  async findOne(id: string, options?: FindItemOptions): Promise<Reservation> {
    console.log("findOne id : ", id);
    return await this.repository.findOne(id, options);
  }

  findOneByQuery(
    query?: SearchItemsParams,
    options?: FindItemOptions,
  ): Promise<Reservation> {
    return this.repository.findOneByQuery(query, options);
  }

  async updateByQuery(
    query: SearchItemsParams,
    payload: Partial<Reservation>,
  ): Promise<string[]> {
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

  async estimateReservationCost(
    payload: EstimateReservationCostDto,
  ): Promise<any> {
    const residence = await this.residenceRepository.findOne(
      payload.residenceId,
    );

    if (!residence) {
      throw new ItemNotFoundException();
    }

    const start =
      typeof payload.dateDebut === "string"
        ? new Date(payload.dateDebut)
        : payload.dateDebut;
    const end =
      typeof payload.dateFin === "string"
        ? new Date(payload.dateFin)
        : payload.dateFin;

    const result = calculateReservationPrice(
      residence.prixReservation,
      start,
      end,
      payload.paymentMethod,
    );

    return result;
  }
}
