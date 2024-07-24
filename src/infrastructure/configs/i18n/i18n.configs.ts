import { INestApplication } from '@nestjs/common';
import {
  AcceptLanguageResolver,
  I18nOptions,
  I18nValidationExceptionFilter,
  I18nValidationPipe,
  QueryResolver,
} from 'nestjs-i18n';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const path = require('path');

export const i18Configs: I18nOptions = {
  fallbackLanguage: 'en',
  loaderOptions: {
    path: path.join('dist/i18n/'),
    watch: true,
  },
  resolvers: [
    { use: QueryResolver, options: ['lang'] },
    AcceptLanguageResolver,
  ],
};

export function configureI18n(app: INestApplication) {
  app.useGlobalPipes(new I18nValidationPipe());
  app.useGlobalFilters(new I18nValidationExceptionFilter());
}
