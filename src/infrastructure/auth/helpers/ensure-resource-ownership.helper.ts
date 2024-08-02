import { UserRole } from "@/core/domain/roles";
import { AccessForbiddenException } from "@/core/domain/auth";

export type VerifyResourceOwnershipOptions = {
  userId: string, ownerId?: unknown, userRole?: string
}

export type VerifyResourceListOwnershipOptions = {
  ressources: any[], userId: string, ownerField: string, userRole?: string
}


export type FilterRessourceByOwnership = {
  ressources: any[], userId: string, ownerField: string, userRole?: string
}

export function verifyResourceOwnership({ userId, ownerId, userRole }: VerifyResourceOwnershipOptions) {
  if (!ownerId) return;
  if (userRole && userRole == UserRole.Admin) return;
  if (ownerId !== userId) throw new AccessForbiddenException();
}

export function verifyResourceListOwnership({
                                              ressources,
                                              userId,
                                              ownerField,
                                              userRole,
                                            }: VerifyResourceListOwnershipOptions) {

  if (userRole && userRole == UserRole.Admin) return;
  for (const ressource of ressources) {
    if (ressource[ownerField] && ressource[ownerField] !== userId) throw new AccessForbiddenException();
  }

}

export function filterRessourceByOwnership<T>({ ressources, userId, ownerField, userRole }) {
  if (userRole && userRole == UserRole.Admin) return ressources;
  const output: T[] = [];
  for (const ressource of ressources) {
    if (ressource[ownerField] && ressource[ownerField] === userId) output.push(ressource);
  }
  return output;
}