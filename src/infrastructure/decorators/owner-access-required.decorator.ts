import { SetMetadata, applyDecorators } from "@nestjs/common";

export const OWNER_ACCESS_REQUIRED_KEY = "OWNER_ACCESS_REQUIRED_KEY";
export const OWNER_ACCESS_REQUIRED_FIELD_KEY =
  "OWNER_ACCESS_REQUIRED_FIELD_KEY";

export function OwnerAccessRequired(ownerField: string): MethodDecorator {
  return applyDecorators(
    SetMetadata(OWNER_ACCESS_REQUIRED_KEY, true),
    SetMetadata(OWNER_ACCESS_REQUIRED_FIELD_KEY, ownerField),
    // UseInterceptors(OwnerAccessRequiredInterceptor),
  );
}
