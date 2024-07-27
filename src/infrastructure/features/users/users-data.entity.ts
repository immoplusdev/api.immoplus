import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User, UserData } from "@/core/domain/users";
import { UserEntity } from "@/infrastructure/features/users/users.entity";
import { FileEntity } from "@/infrastructure/features/files";

@Entity("users_data")
export class UserDataEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user", type: "uuid", nullable: true  })
  @OneToOne(() => UserEntity, (user) => user.additionalData)
  user?: User | string;

  // Pro particulier
  @Column({ name: "lieu_naissance", type: "varchar", nullable: true })
  lieuNaissance?: string;
  @Column({ name: "activite", type: "varchar", nullable: true })
  activite?: string;
  @Column({ name: "photo_identite", type: "uuid", nullable: true })
  @ManyToOne(() => FileEntity, (file) => file.id)
  photoIdentite?: File | string;
  @Column({ name: "piece_identite", type: "uuid", nullable: true })
  @ManyToOne(() => FileEntity, (file) => file.id)
  pieceIdentite?: File | string;

  // Pro entreprise
  @Column({ name: "nom_entreprise", type: "varchar", nullable: true })
  nomEntreprise?: string;
  @Column({ name: "email_entreprise", type: "varchar", nullable: true })
  emailEntreprise?: string;
  @Column({ name: "registre_commerce", type: "uuid", nullable: true })
  @ManyToOne(() => FileEntity, (file) => file.id)
  registreCommerce?: File | string;
  @Column({ name: "numero_contribuable", type: "varchar", nullable: true })
  numeroContribuable?: string;
  @Column({ name: "type_entreprise", type: "varchar", nullable: true })
  typeEntreprise?: string;
}
