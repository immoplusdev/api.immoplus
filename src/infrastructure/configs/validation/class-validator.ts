import { INestApplication, ValidationPipe } from '@nestjs/common';

export function configureAutoValidation(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe());
}
