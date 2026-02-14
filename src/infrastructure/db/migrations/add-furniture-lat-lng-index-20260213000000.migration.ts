import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFurnitureLatLngIndex20260213000000
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("furnitures");
    if (!table) return;

    const hasIndex = table.indices.some(
      (index) => index.name === "IDX_furnitures_lat_lng",
    );

    if (!hasIndex) {
      await queryRunner.query(
        `CREATE INDEX IDX_furnitures_lat_lng ON furnitures (lat, lng)`,
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("furnitures");
    if (!table) return;

    const hasIndex = table.indices.some(
      (index) => index.name === "IDX_furnitures_lat_lng",
    );

    if (hasIndex) {
      await queryRunner.query(`DROP INDEX IDX_furnitures_lat_lng ON furnitures`);
    }
  }
}
