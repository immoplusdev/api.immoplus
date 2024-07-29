import { RegisterCommand } from 'src/core/application/features/auth';
import { AutoMapper, IMapper } from "@/lib/ts-utilities";
import { RegisterCommandDto } from '@/infrastructure/features/auth';

export class RegisterCommandDtoMapper implements IMapper<RegisterCommand, RegisterCommandDto> {
  private mapper: AutoMapper;
  constructor() {
    this.mapper = new AutoMapper();
  }

  mapFrom(param: RegisterCommand): RegisterCommandDto {
    return this.mapper.execute<RegisterCommand, RegisterCommandDto>(param);
  }

  mapTo(param: RegisterCommandDto): RegisterCommand {
    return this.mapper.execute<RegisterCommandDto, RegisterCommand>(param);
  }
}