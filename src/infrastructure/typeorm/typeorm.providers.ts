import { DataSource } from "typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Deps } from "@/core/domain/common/ioc";
import { forwardRef } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";

export const typeormProviders = [
  {
    provide: Deps.DataSource,
    imports: [forwardRef(() => ConfigModule)],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      const sslEnabled = config.get<string>("DB_SSL_ENABLED") === "true";
      const sslCaPath = config.get<string>("DB_SSL_CA_PATH");
      const sslRejectUnauthorized =
        config.get<string>("DB_SSL_REJECT_UNAUTHORIZED") === "true";

      let sslConfig: any = false;

      if (sslEnabled && sslCaPath) {
        const absoluteCaPath = path.isAbsolute(sslCaPath)
          ? sslCaPath
          : path.join(process.cwd(), sslCaPath);

        if (fs.existsSync(absoluteCaPath)) {
          const ca = fs.readFileSync(absoluteCaPath, "utf8");
          sslConfig = {
            ca,
            rejectUnauthorized: sslRejectUnauthorized,
          };
        } else {
          console.warn(`SSL CA certificate not found at: ${absoluteCaPath}`);
        }
      }

      console.log({ type: config.get<string>("DB_CLIENT") as never,
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
        ssl: sslConfig});

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
