import { Module, Provider } from '@nestjs/common';
import { QueryPipe } from './query.pipes';

const pipes: Provider[] = [QueryPipe];

const pipesProviders: Provider[] = [
  {
    provide: 'APP_PIPES',
    useClass: QueryPipe,
  },
];

@Module({
  imports: [],
  providers: [...pipesProviders, ...pipes],
  exports: [...pipes],
})
export class GlobalPipesModule {}
