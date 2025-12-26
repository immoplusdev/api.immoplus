import { Inject } from "@nestjs/common";

export const S3_TOKEN = "S3_INJECT_TOKEN";

export function InjectS3(): ParameterDecorator {
  return Inject(S3_TOKEN);
}
