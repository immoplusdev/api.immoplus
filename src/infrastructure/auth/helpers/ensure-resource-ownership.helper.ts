import { UserRole } from "@/core/domain/roles";
import { AccessForbiddenException } from "@/core/domain/auth";

export function ensureResourceOwnership(userId: string, ownerId?: unknown, userRole?: string) {
  if (!ownerId) return;
  if (userRole && userRole == UserRole.Admin) return;
  if (ownerId !== userId) throw new AccessForbiddenException();
}

export function ensureResourceListOwnership(ressources: any[], userId: string, ownerField: string, userRole?: string) {
  if (userRole && userRole == UserRole.Admin) return;
  for (const ressource of ressources) {
    if (ressource[ownerField] && ressource[ownerField] !== userId) throw new AccessForbiddenException();
  }
}

export function filterRessourceByOwnership<T>(ressources: any[], userId: string, ownerField: string, userRole?: string) {
  if (userRole && userRole == UserRole.Admin) return ressources;
  const output: T[] = [];
  for (const ressource of ressources) {
    if (ressource[ownerField] && ressource[ownerField] === userId) output.push(ressource);
  }
  return output;
}