import { DataSource } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import {
  BienImmobilier,
  IBienImmobilierRepository,
} from "@/core/domain/biens-immobiliers";
import {
  BienImmobilierEntity,
  BienImmobilierEntityMapper,
} from "@/infrastructure/features/biens-immobiliers";
import { BaseRepository } from "@/infrastructure/typeorm";
import {
  SearchBienImmobiliereGeoItemsParams,
  SearchGeolocalizedItemsParams,
  SearchItemsParams,
} from "@/core/domain/http";
import {
  FindItemOptions,
  RepositoryRelations,
  WrapperResponse,
} from "@/core/domain/common/models";
import { GeoJsonType } from "@/core/domain/map/geo-json-type.enum";
import { StatusValidationBienImmobilier } from "@/core/domain/biens-immobiliers/status-validation-bien-immobilier.enum";

@Injectable()
export class BienImmobilierRepository implements IBienImmobilierRepository {
  private readonly repository: BaseRepository<BienImmobilier>;
  private readonly relations: RepositoryRelations = [
    "miniature",
    "video",
    "ville",
    "commune",
    "proprietaire",
  ];
  private readonly fullTextSearchFields: string[] = [
    "id",
    "miniature",
    "nom",
    "typeBienImmobilier",
    "description",
    "typeLocation",
    "aLouer",
    "amentities",
    "tags",
    "images",
    "video",
    "ville",
    "commune",
    "adresse",
    "position",
    "statusValidation",
    "prix",
    "metadata",
    "featured",
    "nombreMaxOccupants",
    "animauxAutorises",
    "bienImmobilierDisponible",
    "fetesAutorises",
    "reglesSupplementaires",
    "proprietaire",
  ];

  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
  ) {
    this.repository = new BaseRepository(
      dataSource,
      BienImmobilierEntity,
      this.relations,
    )
      .setEntityMapper(new BienImmobilierEntityMapper())
      .setFullTextSearchFields(this.fullTextSearchFields);
  }

  async createMany(
    payload: Partial<BienImmobilier>[],
  ): Promise<BienImmobilier[]> {
    // Convert GeoJson to longitude and latitude
    const data = payload.map((item) => ({
      ...item,
      ...(item?.position?.coordinates?.length === 2 &&
        item?.position?.type === GeoJsonType.Point && {
          longitude: item.position.coordinates[0],
          latitude: item.position.coordinates[1],
        }),
    }));
    return await this.repository.createMany(data);
  }

  async createOne(payload: Partial<BienImmobilier>): Promise<BienImmobilier> {
    // Convert GeoJson to longitude and latitude
    const data = {
      ...payload,
      ...(payload?.position?.coordinates?.length === 2 &&
        payload?.position?.type === GeoJsonType.Point && {
          longitude: payload.position.coordinates[0],
          latitude: payload.position.coordinates[1],
        }),
    };
    return await this.repository.createOne(data);
  }

  async findByQuery(
    query?: SearchItemsParams,
  ): Promise<WrapperResponse<BienImmobilier[]>> {
    return await this.repository.findByQuery(query);
  }

  async findOne(
    id: string,
    options?: FindItemOptions,
  ): Promise<BienImmobilier> {
    return this.repository.findOne(id, options);
  }

  async findOneByQuery(
    query?: SearchItemsParams,
    options?: FindItemOptions,
  ): Promise<BienImmobilier> {
    return this.repository.findOneByQuery(query, options);
  }

  async updateByQuery(
    query: SearchItemsParams,
    payload: Partial<BienImmobilier>,
  ): Promise<string[]> {
    return await this.repository.updateByQuery(query, payload);
  }

  async updateOne(
    id: string,
    payload: Partial<BienImmobilier>,
  ): Promise<string> {
    return await this.repository.updateOne(id, payload);
  }

  async deleteByQuery(query: SearchItemsParams): Promise<string[]> {
    return await this.repository.deleteByQuery(query);
  }

  async deleteOne(id: string): Promise<string> {
    return await this.repository.deleteOne(id);
  }

  async findByGeolocation(
    query: SearchBienImmobiliereGeoItemsParams,
  ): Promise<WrapperResponse<BienImmobilier[]>> {
    const DEFAULT_PAGE = 1;
    const DEFAULT_PAGE_SIZE = 10;

    const currentPage = query?._page ?? DEFAULT_PAGE;
    const pageSize = query?._per_page ?? DEFAULT_PAGE_SIZE;
    const search = query?._search?.toLowerCase() || "";

    const qb = this.dataSource
      .getRepository(BienImmobilierEntity)
      .createQueryBuilder("bien")
      .leftJoinAndSelect(
        "bien.miniature",
        "miniature",
        "miniature.deleted_on IS NULL",
      )
      .leftJoinAndSelect("bien.video", "video", "video.deleted_on IS NULL")
      .leftJoinAndSelect("bien.ville", "ville", "ville.deleted_at IS NULL")
      .leftJoinAndSelect(
        "bien.commune",
        "commune",
        "commune.deleted_at IS NULL",
      )
      .leftJoinAndSelect(
        "bien.proprietaire",
        "proprietaire",
        "proprietaire.deleted_at IS NULL",
      )
      .andWhere("bien.bien_immobilier_disponible = :dispo", { dispo: true })
      .andWhere("bien.status_validation = :status", {
        status: StatusValidationBienImmobilier.Valide,
      })
      .andWhere("bien.deleted_at IS NULL")
      .andWhere("bien.latitude IS NOT NULL")
      .andWhere("bien.longitude IS NOT NULL");

    // 🔍 Recherche plein texte
    if (search && this.fullTextSearchFields.length > 0) {
      const searchConditions = this.fullTextSearchFields
        .map((field) => {
          return `LOWER(CAST(bien.${field} AS CHAR)) LIKE :pattern`;
        })
        .join(" OR ");
      qb.andWhere(`(${searchConditions})`, { pattern: `%${search}%` });
    }

    // 📍 Filtre par géolocalisation (Haversine)
    if (query?._lat && query?._long) {
      const radiuis = query?._radius || 5; // Par défaut : 5km
      qb.andWhere(
        `
            6371 * ACOS(
              COS(RADIANS(:lat)) * COS(RADIANS(bien.latitude)) *
              COS(RADIANS(bien.longitude) - RADIANS(:long)) +
              SIN(RADIANS(:lat)) * SIN(RADIANS(bien.latitude))
            ) <= :radius
          `,
        {
          lat: query._lat,
          long: query._long,
          radius: radiuis,
        },
      );
    }

    // 🧮 Filtres dynamiques (_where)
    if (query?._where && Array.isArray(query._where)) {
      query._where.forEach((condition, index) => {
        const { _field, _op = "eq", _val, _l_op = "and" } = condition;
        const paramKey = `whereVal${index}`;
        const column = `bien.${_field}`;

        let expr = "";
        switch (_op) {
          case "eq":
            expr = `${column} = :${paramKey}`;
            break;
          case "neq":
            expr = `${column} != :${paramKey}`;
            break;
          case "gt":
            expr = `${column} > :${paramKey}`;
            break;
          case "gte":
            expr = `${column} >= :${paramKey}`;
            break;
          case "lt":
            expr = `${column} < :${paramKey}`;
            break;
          case "lte":
            expr = `${column} <= :${paramKey}`;
            break;
          case "in":
            expr = `${column} IN (:...${paramKey})`;
            break;
          case "nin":
            expr = `${column} NOT IN (:...${paramKey})`;
            break;
          case "contains":
          case "like":
            expr = `LOWER(CAST(${column} AS CHAR)) LIKE :${paramKey}`;
            break;
          case "ncontains":
            expr = `LOWER(CAST(${column} AS CHAR)) NOT LIKE :${paramKey}`;
            break;
          default:
            return;
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
    if (
      query?._order_by &&
      this.fullTextSearchFields.includes(query._order_by)
    ) {
      const direction =
        query._order_dir?.toUpperCase() === "DESC" ? "DESC" : "ASC";
      qb.orderBy(`bien.${query._order_by}`, direction);
    }

    // 📄 Pagination
    qb.skip((currentPage - 1) * pageSize).take(pageSize);

    // Exécution de la requête
    const [bienImmobiliers, total] = await qb.getManyAndCount();

    return new WrapperResponse(
      this.repository["mapResponse"](bienImmobiliers),
    ).paginate({
      currentPage,
      pageSize,
      totalCount: total,
    });
  }

  async findByGeolocationFilter(
    query: SearchGeolocalizedItemsParams,
  ): Promise<WrapperResponse<BienImmobilier[]>> {
    const DEFAULT_PAGE = 1;
    const DEFAULT_PAGE_SIZE = 10;

    const currentPage = query?._page ?? DEFAULT_PAGE;
    const pageSize = query?._per_page ?? DEFAULT_PAGE_SIZE;
    const search = query?._search?.toLowerCase() || "";

    const qb = this.dataSource
      .getRepository(BienImmobilierEntity)
      .createQueryBuilder("bien")
      .leftJoinAndSelect(
        "bien.miniature",
        "miniature",
        "miniature.deleted_on IS NULL",
      )
      .leftJoinAndSelect("bien.video", "video", "video.deleted_on IS NULL")
      .leftJoinAndSelect("bien.ville", "ville", "ville.deleted_at IS NULL")
      .leftJoinAndSelect(
        "bien.commune",
        "commune",
        "commune.deleted_at IS NULL",
      )
      .leftJoinAndSelect(
        "bien.proprietaire",
        "proprietaire",
        "proprietaire.deleted_at IS NULL",
      )
      .andWhere("bien.bien_immobilier_disponible = :dispo", { dispo: true })
      .andWhere("bien.status_validation = :status", {
        status: StatusValidationBienImmobilier.Valide,
      })
      .andWhere("bien.deleted_at IS NULL");

    // 🔍 Recherche plein texte
    if (search && this.fullTextSearchFields.length > 0) {
      const searchConditions = this.fullTextSearchFields
        .map((field) => {
          return `LOWER(CAST(bien.${field} AS CHAR)) LIKE :pattern`;
        })
        .join(" OR ");
      qb.andWhere(`(${searchConditions})`, { pattern: `%${search}%` });
    }

    // 📍 Filtre par géolocalisation (Haversine)
    if (query?._lat && query?._long) {
      const radiuis = query?._radius || 5; // Par défaut : 5km
      qb.andWhere("bien.latitude IS NOT NULL");
      qb.andWhere("bien.longitude IS NOT NULL");
      qb.andWhere(
        `
            6371 * ACOS(
              COS(RADIANS(:lat)) * COS(RADIANS(bien.latitude)) *
              COS(RADIANS(bien.longitude) - RADIANS(:long)) +
              SIN(RADIANS(:lat)) * SIN(RADIANS(bien.latitude))
            ) <= :radius
          `,
        {
          lat: query._lat,
          long: query._long,
          radius: radiuis,
        },
      );
    }

    // 🧮 Filtres dynamiques (_where)
    if (query?._where && Array.isArray(query._where)) {
      query._where.forEach((condition, index) => {
        const { _field, _op = "eq", _val, _l_op = "and" } = condition;
        const paramKey = `whereVal${index}`;
        const column = `bien.${_field}`;

        let expr = "";
        switch (_op) {
          case "eq":
            expr = `${column} = :${paramKey}`;
            break;
          case "neq":
            expr = `${column} != :${paramKey}`;
            break;
          case "gt":
            expr = `${column} > :${paramKey}`;
            break;
          case "gte":
            expr = `${column} >= :${paramKey}`;
            break;
          case "lt":
            expr = `${column} < :${paramKey}`;
            break;
          case "lte":
            expr = `${column} <= :${paramKey}`;
            break;
          case "in":
            expr = `${column} IN (:...${paramKey})`;
            break;
          case "nin":
            expr = `${column} NOT IN (:...${paramKey})`;
            break;
          case "contains":
          case "like":
            expr = `LOWER(CAST(${column} AS CHAR)) LIKE :${paramKey}`;
            break;
          case "ncontains":
            expr = `LOWER(CAST(${column} AS CHAR)) NOT LIKE :${paramKey}`;
            break;
          default:
            return;
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
    if (
      query?._order_by &&
      this.fullTextSearchFields.includes(query._order_by)
    ) {
      const direction =
        query._order_dir?.toUpperCase() === "DESC" ? "DESC" : "ASC";
      qb.orderBy(`bien.${query._order_by}`, direction);
    }

    // 📄 Pagination
    qb.skip((currentPage - 1) * pageSize).take(pageSize);

    // Exécution de la requête
    const [bienImmobiliers, total] = await qb.getManyAndCount();

    return new WrapperResponse(
      this.repository["mapResponse"](bienImmobiliers),
    ).paginate({
      currentPage,
      pageSize,
      totalCount: total,
    });
  }

  async updateAllCordonates(): Promise<WrapperResponse<BienImmobilier[]>> {
    const biens = await this.repository.findByQuery();
    for (const bien of biens.data) {
      if (bien.position && bien.position.type === GeoJsonType.Point) {
        const position = bien.position;
        await this.repository.updateOne(bien.id, {
          latitude: position.coordinates[1],
          longitude: position.coordinates[0],
        });
      }
    }
    return await this.repository.findByQuery();
  }
}
