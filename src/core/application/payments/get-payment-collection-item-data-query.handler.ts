import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetPaymentCollectionItemDataQueryResponse } from "./get-payment-collection-item-data-query.response";
import { GetPaymentCollectionItemDataQuery } from "./get-payment-collection-item-data.query";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { IReservationRepository } from "@/core/domain/reservations";
import { IDemandeVisiteRepository } from "@/core/domain/demandes-visites";
import {
  PaymentCollection,
  PaymentCollectionItemData,
} from "@/core/domain/payments";

@QueryHandler(GetPaymentCollectionItemDataQuery)
export class GetPaymentCollectionItemDataQueryHandler
  implements IQueryHandler<GetPaymentCollectionItemDataQuery, GetPaymentCollectionItemDataQueryResponse> {
  constructor(
    @Inject(Deps.ReservationRepository) private readonly reservationRepository: IReservationRepository,
    @Inject(Deps.DemandeVisiteRepository) private readonly demandeVisiteRepository: IDemandeVisiteRepository,
  ) {
    //
  }

  async execute(query: GetPaymentCollectionItemDataQuery): Promise<GetPaymentCollectionItemDataQueryResponse> {
    const itemData = new PaymentCollectionItemData();

    if (query.collection == PaymentCollection.Reservation) {
      const data = await this.reservationRepository.findOne(query.itemId);
      itemData.setData({
        itemId: data.id,
        collection: PaymentCollection.Reservation,
        amount: data.montantTotalReservation,
      });
    } else {
      const data = await this.demandeVisiteRepository.findOne(query.itemId);
      itemData.setData({
        itemId: data.id,
        collection: PaymentCollection.DemandeDeVisite,
        amount: data.montantTotalDemandeVisite,
      });
    }

    return itemData;
  }
}
