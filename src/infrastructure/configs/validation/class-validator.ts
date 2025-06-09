import { INestApplication, ValidationPipe } from '@nestjs/common';

export function configureAutoValidation(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true, // optionnel mais recommandé
      forbidNonWhitelisted: false, // optionnel mais recommandé
  }));
}
