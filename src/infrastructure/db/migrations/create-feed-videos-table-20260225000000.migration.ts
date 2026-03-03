import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Crée la table feed_videos avec la même collation que files/users (utf8mb4_general_ci)
 * pour que les FK video_id → files.id et created_by → users.id soient acceptées par MySQL.
 * Sans cela, TypeORM synchronize crée la table avec une collation différente et la FK échoue.
 */
export class CreateFeedVideosTable20260225000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const existing = await queryRunner.getTable("feed_videos");
    if (existing) {
      // Table déjà créée par sync avec mauvaise collation : on corrige les colonnes FK
      await queryRunner.query(`
        ALTER TABLE \`feed_videos\`
          MODIFY \`video_id\` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
          MODIFY \`created_by\` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
      `);
      // Ajouter les FK si elles n'existent pas (sync ne les crée pas avec createForeignKeyConstraints: false)
      const fks = existing.foreignKeys;
      const hasVideoFk = fks.some((fk) => fk.columnNames.includes("video_id"));
      const hasCreatedByFk = fks.some((fk) =>
        fk.columnNames.includes("created_by"),
      );
      const filesTable = await queryRunner.getTable("files");
      const usersTable = await queryRunner.getTable("users");
      if (filesTable && !hasVideoFk) {
        await queryRunner.query(`
          ALTER TABLE \`feed_videos\`
          ADD CONSTRAINT \`FK_feed_videos_video_id_files_id\` FOREIGN KEY (\`video_id\`) REFERENCES \`files\`(\`id\`)
        `);
      }
      if (usersTable && !hasCreatedByFk) {
        await queryRunner.query(`
          ALTER TABLE \`feed_videos\`
          ADD CONSTRAINT \`FK_feed_videos_created_by_users_id\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`)
        `);
      }
      return;
    }

    await queryRunner.query(`
      CREATE TABLE \`feed_videos\` (
        \`id\` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
        \`video_id\` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
        \`parent_type\` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
        \`parent_id\` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
        \`titre\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
        \`description\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`created_by\` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_feed_videos_video_id\` (\`video_id\`),
        INDEX \`IDX_feed_videos_parent_id\` (\`parent_id\`),
        INDEX \`IDX_feed_videos_created_at\` (\`created_at\`),
        CONSTRAINT \`FK_feed_videos_video_id_files_id\` FOREIGN KEY (\`video_id\`) REFERENCES \`files\`(\`id\`),
        CONSTRAINT \`FK_feed_videos_created_by_users_id\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE IF EXISTS `feed_videos`");
  }
}
