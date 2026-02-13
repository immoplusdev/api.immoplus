import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { FileEntity } from "@/infrastructure/features/files";
import { UserEntity } from "@/infrastructure/features/users";
import { VilleEntity } from "@/infrastructure/features/villes";
import { CommuneEntity } from "@/infrastructure/features/communes";
import { GeoJsonPoint } from "@/core/domain/map";
import { FurnitureStatus } from "@/core/domain/furniture";
import { OmitMethods } from "@/lib/ts-utilities";
import { User } from "@/core/domain/users";

@Entity("furnitures")
@Index("IDX_furnitures_lat_lng", ["lat", "lng"])
export class FurnitureEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false })
  @JoinColumn({ name: "owner_id" })
  owner: User | string;

  // ---Gerer La localisation ---

  @ManyToOne(() => VilleEntity, (entity) => entity.id, { nullable: true })
  @JoinColumn({ name: "ville_id" })
  ville?: string;

  @ManyToOne(() => CommuneEntity, (entity) => entity.id, { nullable: true })
  @JoinColumn({ name: "commune_id" })
  commune?: string;

  @Column({ name: "adresse", type: "varchar" })
  adresse: string;

  @Column({ name: "position", type: "json", nullable: true })
  position?: GeoJsonPoint;

  @Column({ name: "lat", type: "double", nullable: true })
  lat?: number;

  @Column({ name: "lng", type: "double", nullable: true })
  lng?: number;

  // --- Contenu ---

  @Column({ name: "titre", type: "varchar" })
  titre: string;

  @Column({ name: "description", type: "text" })
  description: string;

  @Column({
    name: "prix",
    type: "bigint",
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseInt(value, 10),
    },
  })
  prix: number;

  // --- Média ---

  @Column({ name: "images", type: "json", nullable: true })
  images?: string[];

  @ManyToOne(() => FileEntity, (file) => file.id, { nullable: true })
  @JoinColumn({ name: "video_id" })
  video?: string;

  // --- Statistiques ---

  @Column({ name: "views_count", type: "int", default: 0 })
  viewsCount: number;

  // --- Status ---

  @Column({
    name: "status",
    type: "varchar",
    default: FurnitureStatus.Active,
  })
  status: FurnitureStatus;

  // --- Metadata ---

  @Column({ name: "metadata", type: "json", nullable: true })
  metadata?: Record<string, any>;

  // --- Audit ---

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  @JoinColumn({ name: "created_by" })
  createdBy?: string;

  constructor(data?: OmitMethods<FurnitureEntity>) {
    if (data) Object.assign(this, data);
  }
}
