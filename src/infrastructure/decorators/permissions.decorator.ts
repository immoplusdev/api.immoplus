import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const RequiredPermissions = (...permissions: string[][]) =>
  SetMetadata(
    PERMISSIONS_KEY,
    permissions.map((permission) => `${permission[0]}:${permission[1]}`),
  );
