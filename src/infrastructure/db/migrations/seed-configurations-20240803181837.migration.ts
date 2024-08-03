import { MigrationInterface, QueryRunner } from "typeorm";
import { Ville } from "@/core/domain/villes";
import { generateUuid } from "@/lib/ts-utilities/db";
import { AppConfigs } from "@/core/domain/configs";

export class SeedConfiguration20240803181837 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {

    const configurations: Partial<AppConfigs>[] = [
      {
        id: generateUuid(),
        projectName: "My Project",
      },
    ];
    for (const config of configurations) {
      await queryRunner.query(
        `INSERT INTO configurations (id, project_name) VALUES ('${config.id}', '${config.projectName}')`,
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM configurations`);
  }
}