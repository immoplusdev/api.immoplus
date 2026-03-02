import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Crée la table video_view_events pour les analytics de vues vidéo.
 * Utilisée par l'algorithme de personnalisation (watch_duration_ms).
 */
export class CreateVideoViewEventsTable20260301150000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const existing = await queryRunner.getTable("video_view_events");
    if (existing) return;

    await queryRunner.query(`
      CREATE TABLE \`video_view_events\` (
        \`id\` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
        \`video_id\` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
        \`user_id\` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
        \`watch_duration_ms\` int NOT NULL DEFAULT 0,
        \`viewed_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_video_view_events_video_id\` (\`video_id\`),
        INDEX \`IDX_video_view_events_user_id\` (\`user_id\`),
        INDEX \`IDX_video_view_events_viewed_at\` (\`viewed_at\`),
        CONSTRAINT \`FK_video_view_events_video_id\` FOREIGN KEY (\`video_id\`) REFERENCES \`feed_videos\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE IF EXISTS `video_view_events`");
  }
}
