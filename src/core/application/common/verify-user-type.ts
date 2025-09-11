import { InvalidCredentialsException } from "@/core/domain/auth";
import { UserApp, UserRole } from "@/core/domain/roles";
import { User } from "@/core/domain/users";

export function verifyUserType(user: User, source: UserApp) {
  const allowRoles: string[] = [];
  switch (source) {
    case UserApp.AdminApp:
      allowRoles.push(UserRole.Admin);
      break;
    case UserApp.CustomerApp:
      allowRoles.push(UserRole.Customer);
      break;
    case UserApp.ProApp:
      allowRoles.push(UserRole.ProEntreprise, UserRole.ProParticulier);
      break;
  }

  const userrole: string =
    typeof user.role == "string" ? user.role : user.role.id;
  if (!allowRoles.includes(userrole)) {
    throw new InvalidCredentialsException({
      message: "$t:all.exception.forbidden_website",
      statusCode: 403,
      error: "Forbidden",
      code: "FORBIDDEN",
    });
  }
}
