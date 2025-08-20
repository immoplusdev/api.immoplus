import { INestApplication } from "@nestjs/common";
import { QueryPipe } from "@/infrastructure/pipes/query.pipes";

export function globalPipesConfig(app: INestApplication): void {
  app.useGlobalPipes(new QueryPipe());
}
