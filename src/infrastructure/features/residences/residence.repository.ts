import { Brackets, DataSource } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { Residence, IResidenceRepository } from "@/core/domain/residences";
import { ResidenceEntity } from "@/infrastructure/features/residences";
import { BaseRepository } from "@/infrastructure/typeorm";
import { SearchGeolocalizedItemsParams, SearchItemsParams } from "@/core/domain/http";
import { FindItemOptions, RepositoryRelations, WrapperResponse } from "@/core/domain/common/models";
import { ResidenceEntityMapper } from "@/infrastructure/features/residences";
import { StatusValidationBienImmobilier } from "@/core/domain/biens-immobiliers/status-validation-bien-immobilier.enum";
import { GeoJsonType } from "@/core/domain/map/geo-json-type.enum";

@Injectable()
export class ResidenceRepository implements IResidenceRepository {
  private readonly repository: BaseRepository<Residence>;
  private readonly relations: RepositoryRelations = ["miniature", "video", "ville", "commune", "proprietaire"];
  private readonly fullTextSearchFields: string[] = [
    "id",
    "nom",
    "typeResidence",
    "description",
    "commodites",
    "pieces",
    "statusValidation",
    "prixReservation",
    "dureeMinSejour",
    "dureeMaxSejour",
    "heureEntree",
    "heureDepart",
    "nombreMaxOccupants",
    "reglesSupplementaires",
    "proprietaire",
    "ville",
    "commune",
    "adresse",
  ];

  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = new BaseRepository(dataSource, ResidenceEntity, this.relations)
      .setEntityMapper(new ResidenceEntityMapper())
      .setFullTextSearchFields(this.fullTextSearchFields);
  }


  async createMany(payload: Partial<Residence>[]): Promise<Residence[]> {
    // Convert GeoJson to longitude and latitude
    const data = payload.map((item) => ({
      ...item,
      ...(item?.position?.coordinates?.length === 2 
          && item?.position?.type === GeoJsonType.Point 
          && {
            longitude: item.position.coordinates[0],
            latitude: item.position.coordinates[1],
          })
    }))
    return await this.repository.createMany(data);
  }

  async createOne(payload: Partial<Residence>): Promise<Residence> {

    // Convert GeoJson to longitude and latitude
    const data = {
      ...payload,
      ...(payload?.position?.coordinates?.length === 2 
          && payload?.position?.type === GeoJsonType.Point 
          && {
            longitude: payload.position.coordinates[0],
            latitude: payload.position.coordinates[1],
          })
    };
    return await this.repository.createOne(data);
  }


  async findByQuery(query?: SearchItemsParams): Promise<WrapperResponse<Residence[]>> {
    return await this.repository.findByQuery(query);
  }

  async findOne(id: string, options?: FindItemOptions): Promise<Residence> {
    return await this.repository.findOne(id, options);
  }

  findOneByQuery(query?: SearchItemsParams, options?: FindItemOptions): Promise<Residence> {
    return this.repository.findOneByQuery(query, options);
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


  async findAvailableResidencesForToday(
    query?: SearchItemsParams
  ): Promise<WrapperResponse<Residence[]>> {
    const DEFAULT_PAGE = 1;
    const DEFAULT_PAGE_SIZE = 10;

    const currentPage = query?._page ?? DEFAULT_PAGE;
    const pageSize = query?._per_page ?? DEFAULT_PAGE_SIZE;
    const search = query?._search?.trim().toLowerCase() || "";

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    const qb = this.dataSource.getRepository(ResidenceEntity)
      .createQueryBuilder("residence")
      .leftJoin("residence.reservations", "reservation")
      .where(new Brackets(qb => {
        qb.where("reservation.id IS NULL")
          .orWhere(new Brackets(qb2 => {
            qb2.where(":today > DATE(reservation.dateFin)")
              .orWhere(":today < DATE(reservation.dateDebut)");
          }));
      }))
      .setParameters({
        today: formattedDate
      })
      .andWhere("residence.statusValidation = :status", { status: StatusValidationBienImmobilier.Valide })
      .andWhere("residence.residenceDisponible = :dispo", { dispo: true })
      .leftJoinAndSelect("residence.miniature", "miniature")
      .leftJoinAndSelect("residence.video", "video")
      .leftJoinAndSelect("residence.ville", "ville")
      .leftJoinAndSelect("residence.commune", "commune")
      .leftJoinAndSelect("residence.proprietaire", "proprietaire");

    // 📦 Pagination
    qb.skip((currentPage - 1) * pageSize).take(pageSize);

    // 🔍 Recherche plein texte

    if (search && this.fullTextSearchFields.length > 0) {
      const searchConditions = this.fullTextSearchFields.map(field => {
        return `LOWER(CAST(residence.${field} AS CHAR)) LIKE :pattern`;
      }).join(" OR ");
      qb.andWhere(`(${searchConditions})`, { pattern: `%${search}%` });
    }

    // 🧮 Filtres dynamiques (_where)
    if (query?._where && Array.isArray(query._where)) {
      query._where.forEach((condition, index) => {
        const { _field, _op = "eq", _val, _l_op = "and" } = condition;
        const paramKey = `whereVal${index}`;
        const column = `residence.${_field}`;

        let expr = "";
        switch (_op) {
          case "eq": expr = `${column} = :${paramKey}`; break;
          case "neq": expr = `${column} != :${paramKey}`; break;
          case "gt": expr = `${column} > :${paramKey}`; break;
          case "gte": expr = `${column} >= :${paramKey}`; break;
          case "lt": expr = `${column} < :${paramKey}`; break;
          case "lte": expr = `${column} <= :${paramKey}`; break;
          case "in": expr = `${column} IN (:...${paramKey})`; break;
          case "nin": expr = `${column} NOT IN (:...${paramKey})`; break;
          case "contains":
          case "like": expr = `LOWER(CAST(${column} AS CHAR)) LIKE :${paramKey}`; break;
          case "ncontains": expr = `LOWER(CAST(${column} AS CHAR)) NOT LIKE :${paramKey}`; break;
          default: return;
        }

        const value =
          _op === "contains" || _op === "like" || _op === "ncontains"
            ? `%${String(_val).toLowerCase()}%`
            : _val;

        if (_l_op === "or") {
          qb.orWhere(expr, { [paramKey]: value });
        } else {
          qb.andWhere(expr, { [paramKey]: value });
        }
      });
    }

    // 📌 Tri
    if (query?._order_by && this.fullTextSearchFields.includes(query._order_by)) {
      const direction = query._order_dir?.toUpperCase() === "DESC" ? "DESC" : "ASC";
      qb.orderBy(`residence.${query._order_by}`, direction);
    }

    // 📄 Pagination
    qb.skip((currentPage - 1) * pageSize).take(pageSize);

    const [residences, total] = await qb.getManyAndCount();

    return new WrapperResponse(this.repository['mapResponse'](residences)).paginate({
      currentPage,
      pageSize,
      totalCount: total,
    });
  }

  async findByGeolocation(query?: SearchGeolocalizedItemsParams): Promise<WrapperResponse<Residence[]>> {
    const DEFAULT_PAGE = 1;
    const DEFAULT_PAGE_SIZE = 10;

    const currentPage = query?._page ?? DEFAULT_PAGE;
    const pageSize = query?._per_page ?? DEFAULT_PAGE_SIZE;
    const search = query?._search?.toLowerCase() || "";

    const startDate = query?.startDate ?? new Date(); // Par défaut : aujourd'hui
    const endDate = query?.endDate ?? new Date(); // Par défaut : aujourd'hui
    const formattedStartDate = new Date(startDate).toISOString().split("T")[0];
    const formattedEndDate = new Date(endDate).toISOString().split("T")[0];

    const qb = this.dataSource.getRepository(ResidenceEntity)
      .createQueryBuilder("residence")
      .leftJoin("residence.reservations", "reservation", "reservation.deleted_at IS NULL")
      .leftJoinAndSelect("residence.miniature", "miniature", "miniature.deleted_on IS NULL")
      .leftJoinAndSelect("residence.video", "video", "video.deleted_on IS NULL")
      .leftJoinAndSelect("residence.ville", "ville", "ville.deleted_at IS NULL")
      .leftJoinAndSelect("residence.commune", "commune", "commune.deleted_at IS NULL")
      .leftJoinAndSelect("residence.proprietaire", "proprietaire", "proprietaire.deleted_at IS NULL")
      .where(new Brackets(qb => {
        qb.where("reservation.id IS NULL")
          .orWhere(new Brackets(qb2 => {
            qb2.where(":startDate > DATE(reservation.dateFin)")
              .orWhere(":endDate < DATE(reservation.dateDebut)");
          }));
      }))
      .andWhere("residence.status_validation = :status", { status: StatusValidationBienImmobilier.Valide })
      .andWhere("residence.residence_disponible = :dispo", { dispo: true })
      .andWhere("residence.deleted_at IS NULL")
      .andWhere("residence.latitude IS NOT NULL")
      .andWhere("residence.longitude IS NOT NULL")
      .setParameters({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });


    // 🔍 Recherche plein texte
    if (search && this.fullTextSearchFields.length > 0) {
      const searchConditions = this.fullTextSearchFields.map(field => {
        return `LOWER(CAST(residence.${field} AS CHAR)) LIKE :pattern`;
      }).join(" OR ");
      qb.andWhere(`(${searchConditions})`, { pattern: `%${search}%` });
    }

    // 📍 Filtre par géolocalisation (Haversine)
    if (query?.lat && query?.long) {
      const radiuis = query?.radius || 5; // Par défaut : 5km
      qb.andWhere(`
        6371 * ACOS(
          COS(RADIANS(:lat)) * COS(RADIANS(residence.latitude)) *
          COS(RADIANS(residence.longitude) - RADIANS(:long)) +
          SIN(RADIANS(:lat)) * SIN(RADIANS(residence.latitude))
        ) <= :radius
      `, {
        lat: query.lat,
        long: query.long,
        radius: radiuis,
      });
    }

    // 🧮 Filtres dynamiques (_where)
    if (query?._where && Array.isArray(query._where)) {
      query._where.forEach((condition, index) => {
        const { _field, _op = "eq", _val, _l_op = "and" } = condition;
        const paramKey = `whereVal${index}`;
        const column = `residence.${_field}`;

        let expr = "";
        switch (_op) {
          case "eq": expr = `${column} = :${paramKey}`; break;
          case "neq": expr = `${column} != :${paramKey}`; break;
          case "gt": expr = `${column} > :${paramKey}`; break;
          case "gte": expr = `${column} >= :${paramKey}`; break;
          case "lt": expr = `${column} < :${paramKey}`; break;
          case "lte": expr = `${column} <= :${paramKey}`; break;
          case "in": expr = `${column} IN (:...${paramKey})`; break;
          case "nin": expr = `${column} NOT IN (:...${paramKey})`; break;
          case "contains":
          case "like": expr = `LOWER(CAST(${column} AS CHAR)) LIKE :${paramKey}`; break;
          case "ncontains": expr = `LOWER(CAST(${column} AS CHAR)) NOT LIKE :${paramKey}`; break;
          default: return;
        }

        const value =
          _op === "contains" || _op === "like" || _op === "ncontains"
            ? `%${String(_val).toLowerCase()}%`
            : _val;

        if (_l_op === "or") {
          qb.orWhere(expr, { [paramKey]: value });
        } else {
          qb.andWhere(expr, { [paramKey]: value });
        }
      });
    }

    // 📌 Tri
    if (query?._order_by && this.fullTextSearchFields.includes(query._order_by)) {
      const direction = query._order_dir?.toUpperCase() === "DESC" ? "DESC" : "ASC";
      qb.orderBy(`residence.${query._order_by}`, direction);
    }

    // 📄 Pagination
    qb.skip((currentPage - 1) * pageSize).take(pageSize);

    // console.log(qb.getQuery());

    const [residences, total] = await qb.getManyAndCount();

    return new WrapperResponse(this.repository['mapResponse'](residences)).paginate({
      currentPage,
      pageSize,
      totalCount: total,
    });
  }


}
