import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { WrapperResponseDtoMapper } from '@/lib/responses';
import {
  RegisterCommandDto, RegisterCommandDtoMapper,
  RegisterCommandResponseDto,
  WrapperResponseRegisterCommandResponseDto,
} from '@/infrastructure/features/auth/dtos';
import { CommandBus } from '@nestjs/cqrs';

@ApiTags('auth')
@Controller('register-customer')
export class AuthController {
  constructor(readonly commandBus: CommandBus) {
  }

  @ApiResponse({
    type: WrapperResponseRegisterCommandResponseDto,
  })
  @Post()
  async register(@Body() command: RegisterCommandDto) {
    const payloadMapper = new RegisterCommandDtoMapper();
    const responseMapper = new WrapperResponseDtoMapper<RegisterCommandResponseDto>();

    const response = await this.commandBus.execute(payloadMapper.mapTo(command));
    return responseMapper.mapFrom(response);
  }
}
