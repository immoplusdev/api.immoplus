import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '@/infrastructure/features/users/users.entity';
import { Deps } from '@/core/domain/shared/ioc';

@Injectable()
export class UsersService {
  constructor(
    @Inject(Deps.UsersRepository)
    private usersRepository: Repository<UserEntity>,
  ) {}
  test() {
    return 'This action adds a new user';
  }
}
