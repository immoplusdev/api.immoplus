import { Brackets, DataSource, SelectQueryBuilder } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { Residence, IResidenceRepository } from "@/core/domain/residences";
import { ResidenceEntity } from "@/infrastructure/features/residences";
import { BaseRepository } from "@/infrastructure/typeorm";
import {
  SearchGeolocalizedItemsParams,
  SearchItemsParams,
} from "@/core/domain/http";
import {
  FindItemOptions,
  RepositoryRelations,
  WrapperResponse,
} from "@/core/domain/common/models";
import { ResidenceEntityMapper } from "@/infrastructure/features/residences";
import { StatusValidationBienImmobilier } from "@/core/domain/biens-immobiliers/status-validation-bien-immobilier.enum";
import { GeoJsonType } from "@/core/domain/map/geo-json-type.enum";
import { StatusFacture } from "@/core/domain/payments";

@Injectable()
export class ResidenceRepository implements IResidenceRepository {
  private readonly repository: BaseRepository<Residence>;
  private readonly relations: RepositoryRelations = [
    "miniature",
    "video",
    "ville",
    "commune",
    "proprietaire",
  ];
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
    this.repository = new BaseRepository(
      dataSource,
      ResidenceEntity,
      this.relations,
    )
      .setEntityMapper(new ResidenceEntityMapper())
      .setFullTextSearchFields(this.fullTextSearchFields);
  }

  async createMany(payload: Partial<Residence>[]): Promise<Residence[]> {
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

  async createOne(payload: Partial<Residence>): Promise<Residence> {
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
  ): Promise<WrapperResponse<Residence[]>> {
    return await this.repository.findByQuery(query);
  }

  async findOne(id: string, options?: FindItemOptions): Promise<Residence> {
    return await this.repository.findOne(id, options);
  }

  findOneByQuery(
    query?: SearchItemsParams,
    options?: FindItemOptions,
  ): Promise<Residence> {
    return this.repository.findOneByQuery(query, options);
  }

  async updateByQuery(
    query: SearchItemsParams,
    payload: Partial<Residence>,
  ): Promise<string[]> {
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
    query?: SearchItemsParams,
  ): Promise<WrapperResponse<Residence[]>> {
    const DEFAULT_PAGE = 1;
    const DEFAULT_PAGE_SIZE = 10;

    const currentPage = query?._page ?? DEFAULT_PAGE;
    const pageSize = query?._per_page ?? DEFAULT_PAGE_SIZE;
    const search = query?._search?.trim().toLowerCase() || "";

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    const qb = this.dataSource
      .getRepository(ResidenceEntity)
      .createQueryBuilder("residence")
      .leftJoin("residence.reservations", "reservation")
      .where("reservation.statusFacture = :status", {
        status: StatusFacture.Paye,
      })
      .where(
        new Brackets((qb) => {
          qb.where("reservation.id IS NULL").orWhere(
            new Brackets((qb2) => {
              qb2
                .andWhere(":today > DATE(reservation.dateFin)")
                .orWhere(":today < DATE(reservation.dateDebut)");
            }),
          );
        }),
      )
      .setParameters({
        today: formattedDate,
      })
      .andWhere("residence.statusValidation = :status", {
        status: StatusValidationBienImmobilier.Valide,
      })
      .andWhere("residence.residenceDisponible = :dispo", { dispo: true })
      .leftJoinAndSelect("residence.miniature", "miniature")
      .leftJoinAndSelect("residence.video", "video")
      .leftJoinAndSelect("residence.ville", "ville")
      .leftJoinAndSelect("residence.commune", "commune")
      .leftJoinAndSelect("residence.proprietaire", "proprietaire");

    //  Pagination
    qb.skip((currentPage - 1) * pageSize).take(pageSize);

    // Recherche plein texte

    if (search && this.fullTextSearchFields.length > 0) {
      const searchConditions = this.fullTextSearchFields
        .map((field) => {
          return `LOWER(CAST(residence.${field} AS CHAR)) LIKE :pattern`;
        })
        .join(" OR ");
      qb.andWhere(`(${searchConditions})`, { pattern: `%${search}%` });
    }

    //  Filtres dynamiques (_where)
    if (query?._where && Array.isArray(query._where)) {
      query._where.forEach((condition, index) => {
        const { _field, _op = "eq", _val, _l_op = "and" } = condition;
        const paramKey = `whereVal${index}`;
        const column = `residence.${_field}`;

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

    //  Tri
    if (
      query?._order_by &&
      this.fullTextSearchFields.includes(query._order_by)
    ) {
      const direction =
        query._order_dir?.toUpperCase() === "DESC" ? "DESC" : "ASC";
      qb.orderBy(`residence.${query._order_by}`, direction);
    }

    // Pagination
    qb.skip((currentPage - 1) * pageSize).take(pageSize);

    const [residences, total] = await qb.getManyAndCount();

    return new WrapperResponse(
      this.repository["mapResponse"](residences),
    ).paginate({
      currentPage,
      pageSize,
      totalCount: total,
    });
  }

  async findByGeolocation(
    query?: SearchGeolocalizedItemsParams,
  ): Promise<WrapperResponse<Residence[]>> {
    const startTime = performance.now();

    const {
      currentPage,
      pageSize,
      search,
      formattedStartDate,
      formattedEndDate,
      coordinates,
      validatedQuery,
    } = this.prepareQueryParameters(query);

    // Construction de la requête de base avec coordonnées obligatoires
    const qb = this.buildBaseQueryWithCoordinates(
      formattedStartDate,
      formattedEndDate,
    );

    // Application des filtres de manière conditionnelle
    this.applySearchFilter(qb, search);
    this.applyGeolocationFilter(qb, coordinates);
    this.applyDynamicFilters(qb, validatedQuery._where);
    this.applyOrderBy(qb, validatedQuery._order_by, validatedQuery._order_dir);

    // Pagination
    qb.skip((currentPage - 1) * pageSize).take(pageSize);

    try {
      const [residences, total] = await qb.getManyAndCount();

      console.log(
        `Geolocation query executed in ${performance.now() - startTime}ms`,
      );

      return new WrapperResponse(
        this.repository.mapResponse?.(residences) ?? residences,
      ).paginate({
        currentPage,
        pageSize,
        totalCount: total,
      });
    } catch (error) {
      console.error("Geolocation database query failed:", error);
      throw new Error(
        `Failed to fetch residences by geolocation: ${error.message}`,
      );
    }
  }

  async updateAllCordonates(): Promise<WrapperResponse<Residence[]>> {
    const residences = await this.repository.findByQuery();
    for (const residence of residences.data) {
      if (residence.position && residence.position.type === GeoJsonType.Point) {
        const position = residence.position;
        await this.repository.updateOne(residence.id, {
          latitude: position.coordinates[1],
          longitude: position.coordinates[0],
        });
      }
    }
    return await this.repository.findByQuery();
  }

  async findByGeolocationFilter(
    query?: SearchGeolocalizedItemsParams,
  ): Promise<WrapperResponse<Residence[]>> {
    const startTime = performance.now();

    const {
      currentPage,
      pageSize,
      search,
      formattedStartDate,
      formattedEndDate,
      coordinates,
      validatedQuery,
    } = this.prepareQueryParameters(query);

    //  Construction de la requête de base
    const qb = this.buildBaseQuery(formattedStartDate, formattedEndDate);

    //  Application des filtres de manière conditionnelle
    this.applySearchFilter(qb, search);
    this.applyGeolocationFilter(qb, coordinates);
    this.applyDynamicFilters(qb, validatedQuery._where);
    this.applyOrderBy(qb, validatedQuery._order_by, validatedQuery._order_dir);

    // Pagination
    qb.skip((currentPage - 1) * pageSize).take(pageSize);

    try {
      const [residences, total] = await qb.getManyAndCount();

      console.log(`Query executed in ${performance.now() - startTime}ms`);

      return new WrapperResponse(
        this.repository.mapResponse?.(residences) ?? residences,
      ).paginate({
        currentPage,
        pageSize,
        totalCount: total,
      });
    } catch (error) {
      console.error("Database query failed:", error);
      throw new Error(`Failed to fetch residences: ${error.message}`);
    }
  }

  /**
   * Prépare et valide tous les paramètres de requête
   */
  private prepareQueryParameters(query?: SearchGeolocalizedItemsParams) {
    const DEFAULT_PAGE = 1;
    const DEFAULT_PAGE_SIZE = 10;
    const MAX_PAGE_SIZE = 100; // Limite pour éviter les surcharges

    const currentPage = Math.max(1, query?._page ?? DEFAULT_PAGE);
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, query?._per_page ?? DEFAULT_PAGE_SIZE),
    );
    const search = query?._search?.trim()?.toLowerCase() || "";

    // Gestion intelligente des dates
    const { formattedStartDate, formattedEndDate } = this.prepareDateRange(
      query?._start_date,
      query?._end_date,
    );

    // Validation des coordonnées
    const coordinates = this.validateCoordinates(query);

    return {
      currentPage,
      pageSize,
      search,
      formattedStartDate,
      formattedEndDate,
      coordinates,
      validatedQuery: {
        _where: Array.isArray(query?._where) ? query._where : [],
        _order_by: query?._order_by,
        _order_dir: query?._order_dir,
      },
    };
  }

  /**
   * Prépare la plage de dates avec une logique métier optimisée
   */
  private prepareDateRange(startDate?: Date | string, endDate?: Date | string) {
    const now = new Date();

    // Si aucune date spécifiée, cherche les disponibilités à partir d'aujourd'hui
    const start = startDate ? new Date(startDate) : now;
    const end = endDate
      ? new Date(endDate)
      : new Date(start.getTime() + 24 * 60 * 60 * 1000);

    // Validation des dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date format provided");
    }

    if (start > end) {
      throw new Error("Start date must be before end date");
    }

    return {
      formattedStartDate: start.toISOString().split("T")[0],
      formattedEndDate: end.toISOString().split("T")[0],
    };
  }

  /**
   * Valide les coordonnées GPS
   */
  private validateCoordinates(query?: SearchGeolocalizedItemsParams) {
    if (!query?._lat || !query?._long) return null;

    const lat = Number(query._lat);
    const long = Number(query._long);
    const radius = Math.min(100, Math.max(0.1, Number(query._radius) || 5)); // Limité entre 0.1 et 100km

    if (
      isNaN(lat) ||
      isNaN(long) ||
      lat < -90 ||
      lat > 90 ||
      long < -180 ||
      long > 180
    ) {
      throw new Error("Invalid GPS coordinates provided");
    }

    return { lat, long, radius };
  }

  /**
   *  Construit la requête de base optimisée
   */
  private buildBaseQuery(startDate: string, endDate: string) {
    return this.dataSource
      .getRepository(ResidenceEntity)
      .createQueryBuilder("residence")
      .leftJoin(
        "residence.reservations",
        "reservation",
        "reservation.deleted_at IS NULL AND reservation.status_facture = :statusPaye",
      )
      .leftJoinAndSelect(
        "residence.miniature",
        "miniature",
        "miniature.deleted_on IS NULL",
      )
      .leftJoinAndSelect("residence.video", "video", "video.deleted_on IS NULL")
      .leftJoinAndSelect("residence.ville", "ville", "ville.deleted_at IS NULL")
      .leftJoinAndSelect(
        "residence.commune",
        "commune",
        "commune.deleted_at IS NULL",
      )
      .leftJoinAndSelect(
        "residence.proprietaire",
        "proprietaire",
        "proprietaire.deleted_at IS NULL",
      )
      .where(
        new Brackets((qb) => {
          qb.where("reservation.id IS NULL").orWhere(
            new Brackets((qb2) => {
              qb2
                .where("DATE(:startDate) > DATE(reservation.dateFin)")
                .orWhere("DATE(:endDate) < DATE(reservation.dateDebut)");
            }),
          );
        }),
      )
      .andWhere("residence.status_validation = :status", {
        status: StatusValidationBienImmobilier.Valide,
      })
      .andWhere("residence.residence_disponible = true")
      .andWhere("residence.deleted_at IS NULL")
      .setParameters({
        startDate,
        endDate,
        statusPaye: StatusFacture.Paye,
      });
  }

  /**
   * Construit la requête de base avec vérification des coordonnées GPS
   */
  private buildBaseQueryWithCoordinates(startDate: string, endDate: string) {
    return this.buildBaseQuery(startDate, endDate)
      .andWhere("residence.latitude IS NOT NULL")
      .andWhere("residence.longitude IS NOT NULL");
  }

  /**
   * Application optimisée du filtre de recherche textuelle
   */
  private applySearchFilter(
    qb: SelectQueryBuilder<ResidenceEntity>,
    search: string,
  ) {
    if (!search || !this.fullTextSearchFields.length) return;

    // Utilisation d'un index FULLTEXT si disponible, sinon LIKE optimisé
    const searchConditions = this.fullTextSearchFields
      .map((field) => `residence.${field} LIKE :searchPattern`)
      .join(" OR ");

    qb.andWhere(`(${searchConditions})`, {
      searchPattern: `%${search}%`,
    });
  }

  /**
   * Application optimisée du filtre de géolocalisation
   */
  private applyGeolocationFilter(
    qb: SelectQueryBuilder<ResidenceEntity>,
    coordinates: { lat: number; long: number; radius: number } | null,
  ) {
    if (!coordinates) return;

    const { lat, long, radius } = coordinates;

    // Pré-filtre par bounding box pour optimiser les performances
    const latDelta = radius / 111; // Approximation : 1° ≈ 111km
    const longDelta = radius / (111 * Math.cos((lat * Math.PI) / 180));

    qb.andWhere("residence.latitude BETWEEN :minLat AND :maxLat")
      .andWhere("residence.longitude BETWEEN :minLong AND :maxLong")
      .andWhere(
        `
      (6371 * ACOS(LEAST(1, GREATEST(-1,
        COS(RADIANS(:lat)) * COS(RADIANS(residence.latitude)) *
        COS(RADIANS(residence.longitude) - RADIANS(:long)) +
        SIN(RADIANS(:lat)) * SIN(RADIANS(residence.latitude))
      )))) <= :radius
    `,
      )
      .setParameters({
        lat,
        long,
        radius,
        minLat: lat - latDelta,
        maxLat: lat + latDelta,
        minLong: long - longDelta,
        maxLong: long + longDelta,
      });
  }

  /**
   * Application optimisée des filtres dynamiques
   */
  private applyDynamicFilters(
    qb: SelectQueryBuilder<ResidenceEntity>,
    whereConditions: any[],
  ) {
    if (!whereConditions.length) return;

    // Regroupement des conditions par opérateur logique pour optimiser
    const andConditions: string[] = [];
    const orConditions: string[] = [];
    const parameters: Record<string, any> = {};

    whereConditions.forEach((condition, index) => {
      const { _field, _op = "eq", _val, _l_op = "and" } = condition;

      if (!this.isValidField(_field)) {
        console.warn(`Invalid field ignored: ${_field}`);
        return;
      }

      const { expression, paramKey, value } = this.buildFilterExpression(
        _field,
        _op,
        _val,
        index,
      );

      if (expression) {
        parameters[paramKey] = value;

        if (_l_op === "or") {
          orConditions.push(expression);
        } else {
          andConditions.push(expression);
        }
      }
    });

    // Application groupée des conditions
    if (andConditions.length) {
      qb.andWhere(andConditions.join(" AND "), parameters);
    }

    if (orConditions.length) {
      qb.andWhere(`(${orConditions.join(" OR ")})`, parameters);
    }
  }

  /**
   *  Construction optimisée d'une expression de filtre
   */
  private buildFilterExpression(
    _field: string,
    _op: string,
    _val: any,
    index: number,
  ) {
    const paramKey = `whereVal${index}`;
    const column = `residence.${_field}`;

    const operators: Record<string, (col: string, key: string) => string> = {
      eq: (col, key) => `${col} = :${key}`,
      neq: (col, key) => `${col} != :${key}`,
      gt: (col, key) => `${col} > :${key}`,
      gte: (col, key) => `${col} >= :${key}`,
      lt: (col, key) => `${col} < :${key}`,
      lte: (col, key) => `${col} <= :${key}`,
      in: (col, key) => `${col} IN (:...${key})`,
      nin: (col, key) => `${col} NOT IN (:...${key})`,
      like: (col, key) => `${col} LIKE :${key}`,
      contains: (col, key) => `${col} LIKE :${key}`,
      ncontains: (col, key) => `${col} NOT LIKE :${key}`,
    };

    const expression = operators[_op]?.(column, paramKey);
    if (!expression) return { expression: null, paramKey, value: null };

    const value = ["contains", "like", "ncontains"].includes(_op)
      ? `%${String(_val)}%`
      : _val;

    return { expression, paramKey, value };
  }

  /**
   * Application optimisée du tri
   */
  private applyOrderBy(
    qb: SelectQueryBuilder<ResidenceEntity>,
    orderBy?: string,
    orderDir?: string,
  ) {
    if (!orderBy || !this.isValidOrderField(orderBy)) return;

    const direction = orderDir?.toUpperCase() === "DESC" ? "DESC" : "ASC";

    // Ajout d'un tri secondaire par ID pour assurer la cohérence
    qb.orderBy(`residence.${orderBy}`, direction).addOrderBy(
      "residence.id",
      "ASC",
    );
  }

  /**
   *  Validation des champs autorisés
   */
  private isValidField(field: string): boolean {
    const allowedFields = [
      ...this.fullTextSearchFields,
      "prix",
      "surface",
      "nb_chambre",
      "nb_salle_bain",
      "type_bien",
      "status_validation",
    ];

    return typeof field === "string" && allowedFields.includes(field);
  }

  /**
   *  Validation des champs de tri autorisés
   */
  private isValidOrderField(field: string): boolean {
    const allowedOrderFields = [
      ...this.fullTextSearchFields,
      "prix",
      "surface",
      "created_at",
      "updated_at",
      "id",
    ];

    return allowedOrderFields.includes(field);
  }
}
