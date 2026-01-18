import { MigrationInterface, QueryRunner } from "typeorm";
import { UserRole } from "@/core/domain/roles";

export class AddRolesFinancierCommercial20260118000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const newRoles = [
      {
        id: UserRole.Financier,
        name: "Financier",
        admin_access: 1,
      },
      {
        id: UserRole.Commercial,
        name: "Commercial",
        admin_access: 1,
      },
    ];

    for (const role of newRoles) {
      await queryRunner.query(
        `INSERT INTO roles (id, name, admin_access) VALUES ('${role.id}', '${role.name}', '${role.admin_access}')`,
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM roles WHERE id IN ('${UserRole.Financier}', '${UserRole.Commercial}')`,
    );
  }
}
