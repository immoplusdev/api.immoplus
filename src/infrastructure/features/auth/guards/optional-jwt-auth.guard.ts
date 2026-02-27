import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Role } from "@/core/domain/roles";
import { User } from "@/core/domain/users";

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err, user) {
    if (err || !user) return null;
    user.role = new Role(user.role);
    return new User(user) as never;
  }
}
