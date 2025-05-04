import { MigrationInterface, QueryRunner } from "typeorm";
import { UserStatus } from "@/core/domain/users";
import { UserRole } from "@/core/domain/roles";
import { generateUuid } from "@/lib/ts-utilities/db";

export class SeedUsers20240803105953 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const passwordHash = process.env.NEST_APP_ADMIN_PASSWORD_HASH;
    const adminId = process.env.NEST_APP_ADMIN_PASSWORD_ID;

    const users = [
      {
        id: adminId,
        email: "admin@example.com",
        first_name: "Admin",
        last_name: "Admin",
        role_id: UserRole.Admin,
        phone_number: "225-0123456789",
        password: passwordHash,
        status: UserStatus.Active,
        created_by: adminId,
        additional_data_id: adminId,
      },
      {
        id: generateUuid(),
        email: "customer@immoplus.ci",
        first_name: "Customer",
        last_name: "Customer",
        role_id: UserRole.Customer,
        phone_number: "225-0223456789",
        password: passwordHash,
        status: UserStatus.Active,
        created_by: adminId,
        additional_data_id: generateUuid(),
      },
      {
        id: generateUuid(),
        email: "pro-entreprise@immoplus.ci",
        first_name: "ProEntreprise",
        last_name: "ProEntreprise",
        role_id: UserRole.ProEntreprise,
        phone_number: "225-0323456789",
        password: passwordHash,
        status: UserStatus.Active,
        created_by: adminId,
        additional_data_id: generateUuid(),
      },
      {
        id: generateUuid(),
        email: "pro-particulier@immoplus.ci",
        first_name: "ProParticulier",
        last_name: "ProParticulier",
        role_id: UserRole.ProParticulier,
        phone_number: "225-0423456789",
        password: passwordHash,
        status: UserStatus.Active,
        created_by: adminId,
        additional_data_id: generateUuid(),
      },
    ];
    for (const user of users) {
      await queryRunner.query(
        `INSERT INTO users_data (id, activite) VALUES ('${user.additional_data_id}',${null})`,
      );

      await queryRunner.query(
        `INSERT INTO users (id, email, first_name, last_name, role_id, phone_number, password, status, created_by, additional_data_id) VALUES ('${user.id}', '${user.email}', '${user.first_name}', '${user.last_name}', '${user.role_id}', '${user.phone_number}', '${user.password}', '${user.status}', '${user.created_by}', '${user.additional_data_id}')`,
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM users`);
    await queryRunner.query(`DELETE FROM users_data`);
  }
}
