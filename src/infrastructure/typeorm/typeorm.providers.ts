import { DataSource } from "typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Deps } from "@/core/domain/common/ioc";
import { forwardRef } from "@nestjs/common";


export const typeormProviders = [
  {
    provide: Deps.DataSource,
    imports: [
      forwardRef(() => ConfigModule),
    ],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      const dataSource = new DataSource({
        type: config.get<string>("DB_CLIENT") as never,
        host: config.get<string>("DB_HOST"),
        port: config.get<number>("DB_PORT"),
        username: config.get<string>("DB_USER"),
        password: config.get<string>("DB_PASSWORD"),
        database: config.get<string>("DB_DATABASE"),
        entities: [__dirname + "/../../**/*.entity{.ts,.js}"],
        migrations: [__dirname + "/../../**/*.migration{.ts,.js}"],
        synchronize: true,
        migrationsRun: true,
        migrationsTableName: "typeorm_migrations",
      });

      return dataSource.initialize();
    },
  },
];
