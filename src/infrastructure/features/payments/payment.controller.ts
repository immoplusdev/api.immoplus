import { Body, Controller, Post, Inject, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiResponse } from "@nestjs/swagger";
import { Deps } from "@/core/domain/shared/ioc";
import { IPaymentRepository } from "@/core/domain/payments";
import { CurrentUser, RequiredPermissions, RequiredRoles } from "@/infrastructure/decorators";
import { UserRole } from "@/core/domain/roles";
import { PermissionAction, PermissionCollection } from "@/core/domain/permissions";
import { JwtAuthGuard } from "@/infrastructure/auth";
import { WrapperResponseDtoMapper } from "@/lib/responses";
import {
  CreatePaymentIntentCommand,
  WrapperResponseCreatePaymentIntentCommandResponseDto,
  WrapperResponseCreatePaymentIntentCommandResponseDtoMapper,
  PaymentDtoMapper,
} from "@/core/application/features/payments";
import { CommandBus } from "@nestjs/cqrs";

@ApiTags("Payment")
@Controller("payments")
export class PaymentController {

  private readonly dtoMapper = new PaymentDtoMapper();
  private readonly responseMapper = new WrapperResponseDtoMapper(this.dtoMapper);
  private readonly autoMapper = new WrapperResponseDtoMapper();

  constructor(
    private readonly commandBus: CommandBus,
    @Inject(Deps.PaymentRepository)
    private readonly repository: IPaymentRepository,
  ) {
  }

  @ApiResponse({
    type: WrapperResponseCreatePaymentIntentCommandResponseDto,
  })
  @Post("action/create-payment-intent")
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Payments, PermissionAction.Create])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createPaymentIntent(
    @Body() payload: CreatePaymentIntentCommand,
    @CurrentUser("id") userId: string,
  ) {
    const responseMapper = new WrapperResponseCreatePaymentIntentCommandResponseDtoMapper();

    const response = await this.commandBus.execute(new CreatePaymentIntentCommand({ ...payload, userId: userId }));

    return responseMapper.mapFrom(response);
  }

  // @ApiResponse({
  //   type: WrapperResponsePaymentDto,
  // })
  // @Post()
  // @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  // @RequiredPermissions([PermissionCollection.Payments, PermissionAction.Create])
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // async create(
  //   @Body() payload: CreatePaymentDto,
  //   @CurrentUser("id") userId: string,
  // ) {
  //
  //   const payloadMapper = new CreatePaymentDtoMapper();
  //
  //   const response = await this.repository.createOne({ ...payloadMapper.mapTo(payload), createdBy: userId });
  //
  //   return this.responseMapper.mapFrom(response);
  // }
  //
  // @ApiResponse({
  //   type: WrapperResponsePaymentListDto,
  // })
  // @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  // @RequiredPermissions([PermissionCollection.Payments, PermissionAction.Read])
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @OwnerAccessRequired("createdBy")
  // @Get()
  // async readMany(
  //   @Query() params: SearchItemsParamsDto,
  //   @CurrentUser("id") userId: string,
  //   @CurrentUser("role") userRole: Role,
  // ) {
  //   if (!userRole.hasAdminAccess()) params._where = addConditionsToWhereClause([{
  //     _field: "createdBy",
  //     _l_op: "and",
  //     _val: userId,
  //   }], params._where);
  //
  //   const items = await this.repository.findByQuery(params);
  //
  //   return this.responseMapper.mapFromQueryResult(items);
  // }
  //
  // @ApiResponse({
  //   type: WrapperResponsePaymentDto,
  // })
  // @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  // @RequiredPermissions([PermissionCollection.Payments, PermissionAction.Read])
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @OwnerAccessRequired("createdBy")
  // @Get(":id")
  // async readOne(
  //   @Param("id") id: string,
  //   @Query() params?: SelectItemsParamsDto,
  // ) {
  //   const item = await this.repository.findOne(id, { fields: params?._select });
  //
  //   return this.responseMapper.mapFrom(item);
  // }
  //
  //
  // @ApiResponse({
  //   type: WrapperResponsePaymentDto,
  // })
  // @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  // @RequiredPermissions([PermissionCollection.Payments, PermissionAction.Update])
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @Patch(":id")
  // async update(
  //   @Param("id") id: string,
  //   @CurrentUser("id") userId: string,
  //   @CurrentUser("role") userRole: Role,
  //   @Body() payload: UpdatePaymentDto,
  // ) {
  //
  //   const payloadMapper = new UpdatePaymentDtoMapper();
  //
  //   const query = {
  //     _where: [
  //       {
  //         _field: "id",
  //         _val: id,
  //       },
  //     ],
  //   };
  //
  //   if (!userRole.hasAdminAccess()) query._where.push({ _field: "createdBy", _val: userId });
  //
  //   await this.repository.updateByQuery(query, { ...payloadMapper.mapTo(payload), createdBy: userId });
  //
  //   return this.responseMapper.mapFrom((await this.repository.findByQuery(query)).data.at(0));
  // }
  //
  //
  // @ApiResponse({
  //   type: WrapperResponsePaymentDto,
  // })
  // @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  // @RequiredPermissions([PermissionCollection.Payments, PermissionAction.Delete])
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @Delete(":id")
  // async delete(
  //   @Param("id") id: string,
  //   @CurrentUser("id") userId: string,
  //   @CurrentUser("role") userRole: Role) {
  //   const query = {
  //     _where: [
  //       {
  //         _field: "id",
  //         _val: id,
  //       },
  //     ],
  //   };
  //
  //   if (!userRole.hasAdminAccess()) query._where.push({ _field: "createdBy", _val: userId });
  //
  //   await this.repository.deleteByQuery(query);
  //
  //   return this.responseMapper.mapFrom({ id } as never);
  // }

}
