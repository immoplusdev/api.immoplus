import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetPaymentProviderQueryResponse } from "./get-payment-providers-query.response";
import { GetPaymentProviderQuery } from "./get-payment-providers.query";
import { PaymentProviderDto } from "@/core/application/payments/payment-provider.dto";
import { IPaymentGatewayService } from "@/core/domain/payments";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";

@QueryHandler(GetPaymentProviderQuery)
export class GetPaymentProviderQueryHandler
  implements IQueryHandler<GetPaymentProviderQuery, GetPaymentProviderQueryResponse> {
  constructor(
    @Inject(Deps.PaymentGatewayService)
    private readonly paymentGatewayService: IPaymentGatewayService,
  ) {
    //
  }

  async execute(query: GetPaymentProviderQuery): Promise<GetPaymentProviderQueryResponse> {

    // providers.push(
    //   new PaymentProviderDto({
    //     id: "cash",
    //     name: "Cash",
    //     country: "CI",
    //     method: "cash",
    //     currency: "XOF",
    //   }),
    // );
    // return providers.filter((provider) => provider.country == "CI");
    return [];
  }
}
