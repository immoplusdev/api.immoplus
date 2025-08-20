import { INestApplication } from "@nestjs/common";
import { ConfigModuleOptions } from "@nestjs/config";
import * as dotenv from "dotenv";

export const envConfigs: ConfigModuleOptions = {};

export function configureEnv(_app: INestApplication) {
  dotenv.config();
}
