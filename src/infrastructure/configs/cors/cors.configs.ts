import { INestApplication } from "@nestjs/common";

export function corsConfigs(app: INestApplication) {
  app.enableCors();
}
