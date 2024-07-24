import { RegisterCommand } from 'src/core/application/features/auth';
import { IMapper } from '@/lib/ts-utilities';
import { RegisterCommandDto } from '@/infrastructure/features/auth';

export class RegisterCommandDtoMapper implements IMapper<RegisterCommand, RegisterCommandDto> {
  mapFrom(param: RegisterCommand): RegisterCommandDto {
    return new RegisterCommandDto(param);
  }

  mapTo(param: RegisterCommandDto): RegisterCommand {
    return new RegisterCommand(param);
  }
}