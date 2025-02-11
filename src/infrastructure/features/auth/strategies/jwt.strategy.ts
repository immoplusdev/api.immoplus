import { PassportStrategy } from "@nestjs/passport";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { IUserRepository } from "@/core/domain/users";
import { Deps } from "@/core/domain/shared/ioc";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Deps.UsersRepository)
    private readonly usersRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    if (!payload) throw new UnauthorizedException();
    return await this.usersRepository.findOneByIdWithRoleAndPermissions(payload.id);
  }
}
