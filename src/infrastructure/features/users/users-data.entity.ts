import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { User } from "@/core/domain/users";
import { UserEntity } from "@/infrastructure/features/users/users.entity";
import { FileEntity } from "@/infrastructure/features/files";

@Entity("users_data")
export class UserDataEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({ name: "user_id", type: "uuid", nullable: true })
  @OneToOne(() => UserEntity, (user) => user.additionalData)
  user?: User | string;

  // Pro particulier
  @Column({ name: "lieu_naissance", type: "varchar", nullable: true })
  lieuNaissance?: string;
  @Column({ name: "activite", type: "varchar", nullable: true })
  activite?: string;

  @JoinColumn({ name: "photo_identite_id" })
  @ManyToOne(() => FileEntity, (file) => file.id, { nullable: true })
  photoIdentite?: File | string;
  @RelationId((item: UserDataEntity) => item.photoIdentite)
  photoIdentiteId?: string;

  @ManyToOne(() => FileEntity, (file) => file.id, { nullable: true })
  @JoinColumn({ name: "piece_identite_id" })
  pieceIdentite?: File | string;
  @RelationId((item: UserDataEntity) => item.pieceIdentite)
  pieceIdentiteId?: string;

  // Pro entreprise
  @Column({ name: "nom_entreprise", type: "varchar", nullable: true })
  nomEntreprise?: string;
  @Column({ name: "email_entreprise", type: "varchar", nullable: true })
  emailEntreprise?: string;

  @JoinColumn({ name: "registre_commerce_id" })
  @ManyToOne(() => FileEntity, (file) => file.id, { nullable: true })
  registreCommerce?: File | string;
  @RelationId((item: UserDataEntity) => item.registreCommerce)
  registreCommerceId?: string;


  @Column({ name: "numero_contribuable", type: "varchar", nullable: true })
  numeroContribuable?: string;
  @Column({ name: "type_entreprise", type: "varchar", nullable: true })
  typeEntreprise?: string;
}
