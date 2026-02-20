import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { OmitMethods } from "@/lib/ts-utilities";
import { FileEntity } from "@/infrastructure/features/files";
import { VilleEntity } from "@/infrastructure/features/villes";
import { CommuneEntity } from "@/infrastructure/features/communes";
import { GeoJsonPoint } from "@/core/domain/map";
import { UserEntity } from "@/infrastructure/features/users";
import {
  Amentity,
  StatusValidationBienImmobilier,
  TypeBienImmobilier,
  TypeLocationBienImmobilier,
} from "@/core/domain/biens-immobiliers";
import { File } from "@/core/domain/files";
import { Piece } from "@/core/domain/biens-immobiliers/piece.model";

@Entity("biens_immobiliers")
export class BienImmobilierEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => FileEntity, (file) => file.id, { nullable: true })
  @JoinColumn({ name: "miniature_id" })
  miniature: File | string;

  @Column({ name: "nom", type: "varchar" })
  nom: string;

  @Column({ name: "type_bien_immobilier", type: "varchar", nullable: true })
  typeBienImmobilier: TypeBienImmobilier;

  @Column({ name: "description", type: "text" })
  description: string;

  @Column({ name: "amentities", type: "json", nullable: true })
  amentities?: Amentity[];

  @Column({ name: "tags", type: "json", nullable: true })
  tags?: string[];

  // @ManyToMany(() => FileEntity, (file) => file.id, { nullable: true })
  // @JoinColumn({ name: "images" })
  // TODO: Make it many to many
  @Column({ name: "images", type: "json", nullable: true })
  images?: string[];

  @ManyToOne(() => FileEntity, (file) => file.id, { nullable: true })
  @JoinColumn({ name: "video_id" })
  video?: string;

  @ManyToOne(() => VilleEntity, (entity) => entity.id, { nullable: true })
  @JoinColumn({ name: "ville_id" })
  ville?: string;

  @ManyToOne(() => CommuneEntity, (entity) => entity.id, { nullable: true })
  @JoinColumn({ name: "commune_id" })
  commune?: string;

  @Column({ name: "adresse", type: "varchar" })
  adresse?: string;

  @Column({ name: "position", type: "json", nullable: true })
  position?: GeoJsonPoint;

  @Column("double")
  latitude?: number;

  @Column("double")
  longitude?: number;

  @Column({
    name: "status_validation",
    type: "varchar",
    default: StatusValidationBienImmobilier.EnAttenteValidation,
  })
  statusValidation: StatusValidationBienImmobilier;

  @Column({
    name: "prix",
    type: "bigint",
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseInt(value, 10),
    },
  })
  prix: number;

  @Column({ name: "metadata", type: "json", nullable: true })
  metadata?: Record<string, any>;

  @Column({ name: "featured", type: "bool", default: false })
  featured: boolean;

  @Column({ name: "a_louer", type: "bool", nullable: true, default: false })
  aLouer: boolean;

  @Column({ name: "type_location", type: "varchar", nullable: true })
  typeLocation: TypeLocationBienImmobilier;

  @Column({ name: "pieces", type: "json", nullable: true })
  pieces?: Piece[];

  @Column({ name: "bien_immobilier_disponible", type: "bool", nullable: true })
  bienImmobilierDisponible: boolean;

  @Column({ name: "nombre_max_occupants", type: "int", default: 10 })
  nombreMaxOccupants: number;

  @Column({ name: "animaux_autorises", type: "bool", nullable: true })
  animauxAutorises: boolean;

  @Column({ name: "fetes_autorises", type: "bool", default: false })
  fetesAutorises: boolean;

  @Column({ name: "regles_supplementaires", type: "text", nullable: true })
  reglesSupplementaires?: string;

  @Column({ name: "score", type: "int", default: 0 })
  score: number;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  @JoinColumn({ name: "proprietaire_id" })
  proprietaire?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;
  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  @JoinColumn({ name: "created_by" })
  createdBy?: string;

  constructor(data?: OmitMethods<BienImmobilierEntity>) {
    if (data) Object.assign(this, data);
  }
}
