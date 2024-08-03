import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ResidenceEntity } from "@/infrastructure/features/residences";
import { StatusReservation } from "@/core/domain/reservations";
import { ServiceDates } from "@/core/domain/shared/models";
import { StatusFacture } from "@/core/domain/payments/status-facture.enum";
import { UserEntity } from "@/infrastructure/features/users";

@Entity("reservations")
export class ReservationEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => ResidenceEntity, (item) => item.id, { nullable: true })
  @JoinColumn({ name: "residence_id" })
  residence: string;

  @Column({ name: "status_reservation", type: "varchar", length: 30, default: StatusReservation.EnCoursValidationUser })
  statusReservation: StatusReservation;
  @Column({ name: "dates_reservation", type: "json" })
  datesReservation: ServiceDates;
  @Column({ name: "status_facture", type: "varchar", length: 10, default: StatusFacture.NonPaye })
  statusFacture: StatusFacture;

  @Column({ name: "retrait_pro_effectue", type: "bool", default: false })
  retraitProEffectue: boolean;
  @Column({ name: "montant_total_reservation", type: "int" })
  montantTotalReservation: number;
  @Column({ name: "montant_reservation_sans_commission", type: "int" })
  montantReservationSansCommission: number;


  @Column({ name: "notes", type: "text" })
  notes: string;

  @Column({ name: "customer_phone_number", type: "varchar", length: 20 })
  customerPhoneNumber: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;
  // @DeleteDateColumn({ name: "deleted_at" })
  // deletedAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  @JoinColumn({ name: "created_by" })
  createdBy?: string;
  // @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  // @JoinColumn({ name: "updated_by" })
  // updatedBy?: string;
  // @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  // @JoinColumn({ name: "deleted_by" })
  // deletedBy?: string;
}