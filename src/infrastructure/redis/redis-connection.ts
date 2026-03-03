import { ConfigService } from "@nestjs/config";

export function getRedisConnection(config: ConfigService) {
  const url = config.get<string>("REDIS_URL");

  if (url) {
    return { url, tls: {} };
  }

  return {
    host: config.get<string>("REDIS_HOST", "localhost"),
    port: config.get<number>("REDIS_PORT", 6379),
    password: config.get<string>("REDIS_PASSWORD"),
  };
}
