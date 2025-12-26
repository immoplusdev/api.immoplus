import { DataSource } from "typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Deps } from "@/core/domain/common/ioc";
import { forwardRef } from "@nestjs/common";

export const typeormProviders = [
  {
    provide: Deps.DataSource,
    imports: [forwardRef(() => ConfigModule)],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      const sslEnabled = config.get<string>("DB_SSL_ENABLED") === "true";
      const sslCa = config.get<string>("DB_SSL_CA_STRING");
      const sslRejectUnauthorized =
        config.get<string>("DB_SSL_REJECT_UNAUTHORIZED") === "true";

      let sslConfig: any = false;

      if (sslEnabled) {
        sslConfig = {
          ca: sslCa,
          rejectUnauthorized: sslRejectUnauthorized,
        };
      }

      const dataSource = new DataSource({
        type: config.get<string>("DB_CLIENT") as never,
        host: config.get<string>("DB_HOST"),
        port: config.get<number>("DB_PORT"),
        username: config.get<string>("DB_USER"),
        password: config.get<string>("DB_PASSWORD"),
        database: config.get<string>("DB_DATABASE"),
        entities: [__dirname + "/../../**/*.entity{.ts,.js}"],
        migrations: [__dirname + "/../../**/*.migration{.ts,.js}"],
        migrationsTableName: "typeorm_migrations",
        synchronize: config.get<string>("DB_SYNCHRONIZE") == "true",
        migrationsRun: config.get<string>("DB_MIGRATION_RUN") == "true",
        ssl: sslConfig,
      });

      return dataSource.initialize();
    },
  },
];
