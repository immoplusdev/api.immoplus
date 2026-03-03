import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { WorkerModule } from "./worker.module";

async function bootstrap() {
  // Use createApplicationContext (no HTTP server)
  const app = await NestFactory.createApplicationContext(WorkerModule, {
    logger: ["log", "error", "warn"],
  });

  app.enableShutdownHooks();

  console.log("🎬 Video worker started — listening for jobs...");
}

bootstrap().catch((err) => {
  console.error("Worker failed to start:", err);
  process.exit(1);
});
