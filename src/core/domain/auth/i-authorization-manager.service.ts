export interface IAuthorizationManagerService {
  canAccess(roles: string[], permissions: string[]): boolean;
}
