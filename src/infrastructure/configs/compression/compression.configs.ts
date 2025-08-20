import { INestApplication } from "@nestjs/common";
import * as compression from "compression";

export function compressionConfigs(app: INestApplication) {
  app.use(compression());
}
