import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  JoinColumn, JoinTable, ManyToMany,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn, RelationId,
  UpdateDateColumn,
} from "typeorm";
import { FileEntity } from "@/infrastructure/features/files";
import { Commodite, TypeResidence } from "@/core/domain/residences";
import { Piece } from "@/core/domain/residences/piece.model";
import { UserEntity } from "@/infrastructure/features/users";
import { VilleEntity } from "@/infrastructure/features/villes";
import { CommuneEntity } from "@/infrastructure/features/communes";
import { GeoJsonPoint } from "@/core/domain/map";
import { StatusValidationBienImmobilier } from "@/core/domain/biens-immobiliers";
import { OmitMethods } from "@/lib/ts-utilities";
import { File } from "@/core/domain/files";
import { User } from "@/core/domain/users";
import { ReservationEntity } from "../reservations/reservation.entity";

@Entity("residences")
export class ResidenceEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => FileEntity, (file) => file.id, { nullable: true })
  @JoinColumn({ name: "miniature_id" })
  miniature: File | string;

  @Column({ name: "nom", type: "varchar" })
  nom: string;
  @Column({ name: "type_residence", type: "varchar" })
  typeResidence: TypeResidence;
  @Column({ name: "description", type: "text" })
  description: string;
  @Column({ name: "commodites", type: "json", nullable: true })
  commodites?: Commodite[];
  @Column({ name: "pieces", type: "json", nullable: true })
  pieces?: Piece[];


  // @ManyToMany(() => FileEntity, (file) => file.id, { nullable: true })
  // @JoinTable({
  //   name: "residence_images",
  //   joinColumn: {
  //     name: "file_id",
  //     referencedColumnName: "id",
  //   },
  //   inverseJoinColumn: {
  //     name: "residence_id",
  //     referencedColumnName: "id",
  //   },
  // })
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
  @Column({ name: "residence_disponible", type: "bool", default: true })
  residenceDisponible: boolean;
  @Column({ name: "status_validation", type: "varchar", default: StatusValidationBienImmobilier.EnAttenteValidation })
  statusValidation: StatusValidationBienImmobilier;


  @Column({ name: "prix_reservation", type: "int" })
  prixReservation: number;
  @Column({ name: "duree_min_sejour", type: "int", nullable: true })
  dureeMinSejour: number;
  @Column({ name: "duree_max_sejour", type: "int", nullable: true })
  dureeMaxSejour: number;
  @Column({ name: "metadata", type: "json", nullable: true })
  metadata?: Record<string, any>;
  @Column({ name: "heure_entree", type: "varchar", length: 10, nullable: true })
  heureEntree: string;
  @Column({ name: "heure_depart", type: "varchar", length: 10, nullable: true })
  heureDepart: string;
  @Column({ name: "nombre_max_occupants", type: "int", default: 10 })
  nombreMaxOccupants: number;
  @Column({ name: "animaux_autorises", type: "bool", default: false })
  animauxAutorises: boolean;
  @Column({ name: "fetes_autorises", type: "bool", default: false })
  fetesAutorises: boolean;
  @Column({ name: "regles_supplementaires", type: "text", nullable: true })
  reglesSupplementaires?: string;

  @ManyToOne(() => UserEntity, (item) => item.id, { nullable: true })
  @JoinColumn({ name: "proprietaire_id" })
  proprietaire?: User | string;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;
  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  @JoinColumn({ name: "created_by" })
  createdBy?: string;
  // @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  // @JoinColumn({ name: "updated_by" })
  // updatedBy?: string;
  // @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  // @JoinColumn({ name: "deleted_by" })
  // deletedBy?: string;


  @OneToMany(() => ReservationEntity, (reservation) => reservation.residence)
  reservations?: ReservationEntity[];
  constructor(data?: OmitMethods<ResidenceEntity>) {
    if (data) Object.assign(this, data);
  }
}