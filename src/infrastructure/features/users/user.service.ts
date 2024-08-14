import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '@/infrastructure/features/users/user.entity';
import { Deps } from '@/core/domain/shared/ioc';

@Injectable()
export class UserService {
  constructor(
    @Inject(Deps.UsersRepository)
    private usersRepository: Repository<UserEntity>,
  ) {}
  test() {
    return 'This action adds a new user';
  }
}
