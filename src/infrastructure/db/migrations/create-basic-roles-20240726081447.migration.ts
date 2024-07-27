import { MigrationInterface, QueryRunner } from "typeorm";
import { UserRole } from "@/core/domain/roles";

export class CreateBasicRoles20240726081447 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const roles = [
      {
        id: UserRole.Customer,
        name: UserRole.Customer.toString(),
        admin_access: 0,
      },
      {
        id: UserRole.Admin,
        name: UserRole.Admin.toString(),
        admin_access: 1,
      },
      {
        id: UserRole.ProEntreprise,
        name: UserRole.ProEntreprise.toString(),
        admin_access: 0,
      },
      {
        id: UserRole.ProParticulier,
        name: UserRole.ProParticulier.toString(),
        admin_access: 0,
      },
    ];

    await queryRunner.query(`
      CREATE TABLE \`roles\` (
        \`id\` varchar(36) NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`description\` varchar(255) DEFAULT NULL,
        \`icon\` varchar(255) DEFAULT NULL,
        \`enforce_tfa\` tinyint NOT NULL DEFAULT '0',
        \`app_access\` tinyint NOT NULL DEFAULT '0',
        \`admin_access\` tinyint NOT NULL DEFAULT '0'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);


    for (const role of roles) {
      await queryRunner.query(
        `INSERT INTO roles (id, name, admin_access) VALUES ('${role.id}', '${role.name}', '${role.admin_access}')`,
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM ROLES`,
    );
  }
}