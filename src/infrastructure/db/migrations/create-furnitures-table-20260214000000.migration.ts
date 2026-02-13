import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFurnituresTable20260214000000
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    const existing = await queryRunner.getTable("furnitures");

    if (!existing) {
      await queryRunner.query(`
        CREATE TABLE \`furnitures\` (
          \`id\` varchar(36) NOT NULL,
          \`owner_id\` varchar(36) NOT NULL,
          \`ville_id\` varchar(36) DEFAULT NULL,
          \`commune_id\` varchar(36) DEFAULT NULL,
          \`adresse\` varchar(255) NOT NULL,
          \`position\` json DEFAULT NULL,
          \`lat\` double DEFAULT NULL,
          \`lng\` double DEFAULT NULL,
          \`titre\` varchar(255) NOT NULL,
          \`description\` text NOT NULL,
          \`prix\` bigint NOT NULL DEFAULT '0',
          \`images\` json DEFAULT NULL,
          \`video_id\` varchar(36) DEFAULT NULL,
          \`views_count\` int NOT NULL DEFAULT '0',
          \`status\` varchar(255) NOT NULL DEFAULT 'active',
          \`metadata\` json DEFAULT NULL,
          \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          \`deleted_at\` datetime(6) DEFAULT NULL,
          \`created_by\` varchar(36) DEFAULT NULL,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
      `);
    }

    const table = await queryRunner.getTable("furnitures");
    if (!table) return;

    const hasIndex = (name: string) =>
      table.indices.some((index) => index.name === name);

    if (!hasIndex("IDX_furnitures_owner_id")) {
      await queryRunner.query(
        "CREATE INDEX IDX_furnitures_owner_id ON furnitures (owner_id)",
      );
    }
    if (!hasIndex("IDX_furnitures_ville_id")) {
      await queryRunner.query(
        "CREATE INDEX IDX_furnitures_ville_id ON furnitures (ville_id)",
      );
    }
    if (!hasIndex("IDX_furnitures_commune_id")) {
      await queryRunner.query(
        "CREATE INDEX IDX_furnitures_commune_id ON furnitures (commune_id)",
      );
    }
    if (!hasIndex("IDX_furnitures_video_id")) {
      await queryRunner.query(
        "CREATE INDEX IDX_furnitures_video_id ON furnitures (video_id)",
      );
    }
    if (!hasIndex("IDX_furnitures_created_by")) {
      await queryRunner.query(
        "CREATE INDEX IDX_furnitures_created_by ON furnitures (created_by)",
      );
    }
    if (!hasIndex("IDX_furnitures_lat_lng")) {
      await queryRunner.query(
        "CREATE INDEX IDX_furnitures_lat_lng ON furnitures (lat, lng)",
      );
    }

    const hasFkOnColumn = (column: string) =>
      table.foreignKeys.some((fk) => fk.columnNames.includes(column));

    const usersTable = await queryRunner.getTable("users");
    const villesTable = await queryRunner.getTable("villes");
    const communesTable = await queryRunner.getTable("communes");
    const filesTable = await queryRunner.getTable("files");

    if (usersTable && !hasFkOnColumn("owner_id")) {
      await queryRunner.query(`
        ALTER TABLE \`furnitures\`
        ADD CONSTRAINT \`FK_furnitures_owner_id_users_id\`
        FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`)
      `);
    }
    if (villesTable && !hasFkOnColumn("ville_id")) {
      await queryRunner.query(`
        ALTER TABLE \`furnitures\`
        ADD CONSTRAINT \`FK_furnitures_ville_id_villes_id\`
        FOREIGN KEY (\`ville_id\`) REFERENCES \`villes\`(\`id\`)
      `);
    }
    if (communesTable && !hasFkOnColumn("commune_id")) {
      await queryRunner.query(`
        ALTER TABLE \`furnitures\`
        ADD CONSTRAINT \`FK_furnitures_commune_id_communes_id\`
        FOREIGN KEY (\`commune_id\`) REFERENCES \`communes\`(\`id\`)
      `);
    }
    if (filesTable && !hasFkOnColumn("video_id")) {
      await queryRunner.query(`
        ALTER TABLE \`furnitures\`
        ADD CONSTRAINT \`FK_furnitures_video_id_files_id\`
        FOREIGN KEY (\`video_id\`) REFERENCES \`files\`(\`id\`)
      `);
    }
    if (usersTable && !hasFkOnColumn("created_by")) {
      await queryRunner.query(`
        ALTER TABLE \`furnitures\`
        ADD CONSTRAINT \`FK_furnitures_created_by_users_id\`
        FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`)
      `);
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE IF EXISTS furnitures");
  }
}
