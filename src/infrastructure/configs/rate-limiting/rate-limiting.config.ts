import { ThrottlerModuleOptions } from "@nestjs/throttler/dist/throttler-module-options.interface";

// TODO: Implement rate limiting for auth otp endpoints
export const throttlerModuleConfig = [
  {
    ttl: 60000,
    limit: 10,
  },
];

export const rateLimitingConfig: ThrottlerModuleOptions = [
  {
    name: "short",
    ttl: 1000,
    limit: 3,
  },
  {
    name: "medium",
    ttl: 10000,
    limit: 20,
  },
  {
    name: "long",
    ttl: 60000,
    limit: 100,
  },
];
//   {
//   ttl: 60,
//   limit: 10,
// } as never;
