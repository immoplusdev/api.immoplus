import { Body, Controller, Post, Inject, UseGuards, Get, Query, Param, HttpCode, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiNoContentResponse, ApiTags } from "@nestjs/swagger";
import { ApiResponse } from "@nestjs/swagger";
import { Deps } from "@/core/domain/shared/ioc";
import { IPaymentRepository } from "@/core/domain/payments";
import {
  CurrentUser,
  OwnerAccessRequired,
  ReqHeaders,
  RequiredPermissions,
  RequiredRoles,
} from "@/infrastructure/decorators";
import { Role, UserRole } from "@/core/domain/roles";
import { PermissionAction, PermissionCollection } from "@/core/domain/permissions";
import { WrapperResponseDtoMapper } from "@/lib/responses";
import {
  CreatePaymentIntentCommand,
  WrapperResponseCreatePaymentIntentCommandResponseDto,
  WrapperResponseCreatePaymentIntentCommandResponseDtoMapper,
  PaymentDtoMapper,
  WrapperResponsePaymentListDto,
  WrapperResponsePaymentDto,
  WrapperResponseGetPaymentProviderQueryResponseDto,
  WrapperResponseGetPaymentProviderQueryResponseDtoMapper,
  GetPaymentProviderQuery,
  InterceptPaymentWebhookCommand,
  CreateDemandeRetraitReservationCommand,
  UpdatePaymentDto,
  UpdatePaymentDtoMapper,
} from "@/core/application/features/payments";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
  AuthenticatePaymentIntentCommand,
} from "@/core/application/features/payments/authenticate-payment-intent.command";
import { SearchItemsParamsDto, SelectItemsParamsDto } from "@/infrastructure/http";
import { addConditionsToWhereClause } from "@/infrastructure/helpers";
import { Hub2PaymentGatewayService } from "@/infrastructure/features/payments/hub2";
import { JwtAuthGuard } from "@/infrastructure/features/auth";

@ApiTags("Payment")
@Controller("payments")
export class PaymentController {

  private readonly dtoMapper = new PaymentDtoMapper();
  private readonly responseMapper = new WrapperResponseDtoMapper(this.dtoMapper);
  private readonly autoMapper = new WrapperResponseDtoMapper();

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
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


  @Post("action/create-demande-retrait-reservation")
  @ApiNoContentResponse()
  @HttpCode(204)
  @RequiredRoles(UserRole.Admin, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Payments, PermissionAction.Create])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createDemandeRetraitReservation(
    @Body() payload: CreateDemandeRetraitReservationCommand,
    @CurrentUser("id") userId: string,
  ) {
    await this.commandBus.execute(new CreateDemandeRetraitReservationCommand({
      ...payload,
      userId,
    }));
  }

  @ApiResponse({
    type: WrapperResponseCreatePaymentIntentCommandResponseDto,
  })
  @Post("action/authenticate-payment-intent")
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Payments, PermissionAction.Create])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async authenticatePaymentIntent(
    @Body() payload: AuthenticatePaymentIntentCommand,
    @CurrentUser("id") userId: string,
  ) {
    const responseMapper = new WrapperResponseCreatePaymentIntentCommandResponseDtoMapper();

    const response = await this.commandBus.execute(new AuthenticatePaymentIntentCommand({
      ...payload,
      userId: userId,
    }));

    return responseMapper.mapFrom(response);
  }

  @ApiResponse({
    type: WrapperResponsePaymentListDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Payments, PermissionAction.Read])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @OwnerAccessRequired("createdBy")
  @Get()
  async readMany(
    @Query() params: SearchItemsParamsDto,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
  ) {
    if (!userRole.hasAdminAccess()) params._where = addConditionsToWhereClause([{
      _field: "customer",
      _l_op: "and",
      _val: userId,
    }], params._where);

    const items = await this.repository.findByQuery(params);

    return this.responseMapper.mapFromQueryResult(items);
  }


  @ApiResponse({
    type: WrapperResponsePaymentDto,
  })
  @RequiredRoles(UserRole.Admin, UserRole.Customer, UserRole.ProEntreprise, UserRole.ProParticulier)
  @RequiredPermissions([PermissionCollection.Payments, PermissionAction.Read])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @OwnerAccessRequired("customerId")
  @Get(":id")
  async readOne(
    @Param("id") id: string,
    @Query() params?: SelectItemsParamsDto,
  ) {
    const item = await this.repository.findOne(id, { fields: params?._select });

    return this.responseMapper.mapFrom(item);
  }


  @ApiResponse({
    type: WrapperResponseGetPaymentProviderQueryResponseDto,
  })
  @Get("data/providers")
  async getPaymentsProviders() {
    const responseMapper = new WrapperResponseGetPaymentProviderQueryResponseDtoMapper();

    const response = await this.queryBus.execute(new GetPaymentProviderQuery());

    return responseMapper.mapFrom(response);
  }

  @Post("webhook")
  @ApiNoContentResponse()
  @HttpCode(204)
  public async webhook(
    @Body() payload: Record<string, any>,
    @ReqHeaders() headers: Record<string, string>,
  ): Promise<void> {
    const json = JSON.stringify(payload);
    const webHookSignature = Hub2PaymentGatewayService.getWebhookSignatureFromHeaders(headers);

    const command = new InterceptPaymentWebhookCommand({
      type: payload?.type,
      signature: webHookSignature,
      json,
      payments: payload?.data?.payments,
      amount: payload?.data?.amount,
      token: payload?.data?.token,
      status: payload?.data?.status as never,
      nextAction: payload?.data?.nextAction,
    });

    await this.commandBus.execute(command);
  }


  @ApiResponse({
    type: WrapperResponsePaymentDto,
  })
  @RequiredRoles(UserRole.Admin)
  @RequiredPermissions([PermissionCollection.Payments, PermissionAction.Update])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @CurrentUser("role") userRole: Role,
    @Body() payload: UpdatePaymentDto,
  ) {

    const payloadMapper = new UpdatePaymentDtoMapper();

    const query = {
      _where: [
        {
          _field: "id",
          _val: id,
        },
      ],
    };

    if (!userRole.hasAdminAccess()) query._where.push({ _field: "createdBy", _val: userId });

    await this.repository.updateByQuery(query, { ...payloadMapper.mapTo(payload), createdBy: userId });

    return this.responseMapper.mapFrom((await this.repository.findByQuery(query)).data.at(0));
  }
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
