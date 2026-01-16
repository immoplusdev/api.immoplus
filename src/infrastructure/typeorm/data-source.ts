import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

const sslEnabled = process.env.DB_SSL_ENABLED === "true";
const sslCa = process.env.DB_SSL_CA_STRING;
const sslRejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED === "true";

let sslConfig: any = false;

if (sslEnabled) {
  sslConfig = {
    ca: sslCa,
    rejectUnauthorized: sslRejectUnauthorized,
  };
}

export default new DataSource({
  type: process.env.DB_CLIENT as any,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306", 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/../db/migrations/*{.ts,.js}"],
  migrationsTableName: "typeorm_migrations",
  ssl: sslConfig,
});
