import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { metaConfigs } from "../application/meta.configs";

export function swaggerConfigs(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle(metaConfigs.projectName)
    .setDescription(metaConfigs.projectDescription)
    .setVersion(metaConfigs.projectVersion)
    .addTag(metaConfigs.projectTag)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document, {
    jsonDocumentUrl: "swagger/json",
  });
}
