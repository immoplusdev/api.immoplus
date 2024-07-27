import { AccessForbiddenException } from "@/core/domain/shared/exceptions";

export function ensureResourceOwnership(userId: string, ownerId?: unknown) {
  if (!ownerId) return;
  if (ownerId !== userId) throw new AccessForbiddenException();
}

export function ensureResourceListOwnership(ressources: any[], userId: string, ownerField: string) {
  for (const ressource of ressources) {
    if (ressource[ownerField] && ressource[ownerField] !== userId) throw new AccessForbiddenException();
  }
}