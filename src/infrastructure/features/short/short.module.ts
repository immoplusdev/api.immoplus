import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { TypeormModule } from "@/infrastructure/typeorm";
import { ShortService } from "./short.service";
import { ShortController } from "./short.controller";

@Module({
  imports: [TypeormModule],
  controllers: [ShortController],
  providers: [
    ShortService,
    {
      provide: "REDIS_CLIENT",
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>("REDIS_URL");

        if (url) {
          return new Redis(url, { tls: {} });
        }

        return new Redis({
          host: config.get<string>("REDIS_HOST", "localhost"),
          port: config.get<number>("REDIS_PORT", 6379),
          password: config.get<string>("REDIS_PASSWORD"),
        });
      },
    },
  ],
})
export class ShortModule {}
