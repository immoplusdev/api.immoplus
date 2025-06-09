import { INestApplication } from '@nestjs/common';
import {
  AcceptLanguageResolver, HeaderResolver,
  I18nOptions,
  I18nValidationExceptionFilter,
  I18nValidationPipe,
  QueryResolver,
} from "nestjs-i18n";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const path = require('path');

export const i18Configs: I18nOptions = {
  fallbackLanguage: 'fr',
  loaderOptions: {
    path: path.join('dist/i18n/'),
    watch: true,
  },
  resolvers: [
    { use: QueryResolver, options: ['lang'] },
    new HeaderResolver(['x-custom-lang']),
    AcceptLanguageResolver,
  ],
};

export function configureI18n(app: INestApplication) {
  app.useGlobalPipes(new I18nValidationPipe({
    transform: true,
    whitelist: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  app.useGlobalFilters(new I18nValidationExceptionFilter());
}
