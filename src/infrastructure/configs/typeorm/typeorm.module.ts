import { Module } from '@nestjs/common';
import { typeormProviders } from './typeorm.providers';

@Module({
  providers: [...typeormProviders],
  exports: [...typeormProviders],
})
export class TypeormModule {}
