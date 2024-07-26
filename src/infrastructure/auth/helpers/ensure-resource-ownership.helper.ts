import { AccessForbiddenException } from "@/core/domain/shared/exceptions";

export function ensureResourceOwnership(userId: string, ownerId?: unknown) {
  if (!ownerId) return;
  if (ownerId !== userId) new AccessForbiddenException();
}

export function ensureResourceListOwnership(ressources: any[], userId: string, ownerField: string) {
  for (const ressource of ressources) {
    if (ressource[ownerField] && ressource[ownerField] !== userId) new AccessForbiddenException();
  }
}