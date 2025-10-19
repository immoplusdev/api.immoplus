import { PaymentMethod } from "@/core/domain/common/enums";

export function calculateReservationPrice(
  residencePrice: number,
  startDate: Date,
  endDate: Date,
  paymentMethod?: PaymentMethod,
): any{
  if (startDate >= endDate) {
    throw new Error("La date de début doit être antérieure à la date de fin.");
  }

  const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

  const montant = residencePrice * diffDays;
  let pourcentage = 0;

  switch (paymentMethod) {
    case PaymentMethod.Wave:
      pourcentage = 2;
    case PaymentMethod.MoovMoney:
      pourcentage = 2;
    case PaymentMethod.MtnMoney:
      pourcentage = 2;
    case PaymentMethod.OrangeMoney:
      pourcentage = 2;
    default:
      pourcentage = 2;
  }

  const fees = Math.ceil((montant * pourcentage) / 100 / 5) * 5;
  const total = montant + fees;

  return {
    pourcentage: pourcentage,
    montant: montant,
    frais: fees,
    total: total,
  };
}
