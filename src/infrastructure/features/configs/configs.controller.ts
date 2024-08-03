import { Body, Controller, Get, Inject, UseGuards, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiResponse } from "@nestjs/swagger";
import { Deps } from "@/core/domain/shared/ioc";
import { IConfigsManagerService } from "@/core/domain/configs";
import { RequiredPermissions, RequiredRoles } from "@/infrastructure/decorators";
import { UserRole } from "@/core/domain/roles";
import { PermissionAction, PermissionCollection } from "@/core/domain/permissions";
import { JwtAuthGuard } from "@/infrastructure/auth";
import { WrapperResponseDtoMapper } from "@/lib/responses";
import { WrapperResponsePublicConfigDto } from "@/infrastructure/features/configs/dto";
import { UpdateConfigDto } from "@/infrastructure/features/configs/dto/update-configs.dto";

@ApiTags("Configs")
@Controller("configs")
export class ConfigController {
  constructor(
    @Inject(Deps.ConfigsManagerService)
    private readonly configsManagerService: IConfigsManagerService,
  ) {
  }

  @ApiResponse({
    type: WrapperResponsePublicConfigDto,
  })
  @Get()
  async readSingleton() {
    const responseMapper = new WrapperResponseDtoMapper<WrapperResponsePublicConfigDto>();

    const item = await this.configsManagerService.getPublicConfigs();

    return responseMapper.mapFrom(item as never);
  }


  @ApiResponse({
    type: WrapperResponsePublicConfigDto,
  })
  @RequiredRoles(UserRole.Admin)
  @RequiredPermissions([PermissionCollection.Configurations, PermissionAction.Read])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch()
  async update(
    @Body() payload: UpdateConfigDto,
  ) {
    const responseMapper = new WrapperResponseDtoMapper<WrapperResponsePublicConfigDto>();

    await this.configsManagerService.updateAppConfigs(payload);
    const item = await this.configsManagerService.getPublicConfigs();
    return responseMapper.mapFrom(item as never);
  }
}
