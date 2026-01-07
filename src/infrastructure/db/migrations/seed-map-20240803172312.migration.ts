import { MigrationInterface, QueryRunner } from "typeorm";
import { Ville } from "@/core/domain/villes";
import { generateUuid } from "@/lib/ts-utilities/db";
import { Commune } from "@/core/domain/communes";

export class SeedMap20240803172312 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const defaultVilleId = process.env.NEST_APP_ADMIN_PASSWORD_ID;
    const villes: Partial<Ville>[] = [
      {
        id: defaultVilleId,
        name: "Abidjan",
      },
      {
        id: generateUuid(),
        name: "Bouaké",
      },
      {
        id: generateUuid(),
        name: "Yamoussoukro",
      },
    ];

    const communes: Partial<Commune>[] = [
      {
        id: defaultVilleId,
        name: "Cocody",
        ville: defaultVilleId,
      },
      {
        id: generateUuid(),
        name: "Yopougon",
        ville: defaultVilleId,
      },
    ];

    for (const ville of villes) {
      await queryRunner.query(
        `INSERT IGNORE INTO villes (id, name) VALUES ('${ville.id}', '${ville.name}')`,
      );
    }

    for (const commune of communes) {
      await queryRunner.query(
        `INSERT IGNORE INTO communes (id, name, ville_id) VALUES ('${commune.id}', '${commune.name}', '${commune.ville}')`,
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM villes`);
    await queryRunner.query(`DELETE FROM communes`);
  }
}
