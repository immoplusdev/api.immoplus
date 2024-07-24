import { INestApplication } from '@nestjs/common';
import { QueryPipe } from '../../core/pipes/query.pipes';

export function globalPipesConfig(app: INestApplication): void {
  app.useGlobalPipes(new QueryPipe());
}
