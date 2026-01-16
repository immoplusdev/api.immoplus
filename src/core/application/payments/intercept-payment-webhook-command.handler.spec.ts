import { Test, TestingModule } from "@nestjs/testing";
import { InterceptPaymentWebhookCommandHandler } from "./intercept-payment-webhook-command.handler";
import { ReservationRepository } from "@/infrastructure/features/reservations/reservation.repository";
import { ResidenceRepository } from "@/infrastructure/features/residences/residence.repository";
import { WalletsService } from "@/infrastructure/features/wallets/wallet.service";
import { NotificationService } from "@/infrastructure/features/notifications/notification.service";
import { GlobalizationService } from "@/infrastructure/features/globalization";
import { TransactionSource } from "@/core/domain/wallet";
import { JwtModule } from "@nestjs/jwt";
import { PaymentMethod } from "@/core/domain/common/enums/payment-method.enum";

describe("InterceptPaymentWebhookCommandHandler", () => {
  let handler: InterceptPaymentWebhookCommandHandler;

  const mockReservationRepository = {
    findOne: jest.fn(),
  };

  const mockResidenceRepository = {
    findOne: jest.fn(),
  };

  const mockWalletService = {
    creditWallet: jest.fn(),
  };

  const mockNotificationService = {
    sendNotification: jest.fn(),
  };

  const mockGlobalizationService = {
    t: jest
      .fn()
      .mockReturnValue({ subject: "texte traduit", message: "texte traduit" }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterceptPaymentWebhookCommandHandler,
        { provide: ReservationRepository, useValue: mockReservationRepository },
        { provide: ResidenceRepository, useValue: mockResidenceRepository },
        { provide: WalletsService, useValue: mockWalletService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: GlobalizationService, useValue: mockGlobalizationService },
        {
          provide: JwtModule,
          useValue: {
            register: jest.fn(() => ({
              module: {
                providers: [],
                exports: [],
              },
            })),
          },
        },
      ],
    }).compile();

    handler = module.get(InterceptPaymentWebhookCommandHandler);
    jest.clearAllMocks();
  });

  it("doit créditer le wallet et envoyer une notification si tout est valide", async () => {
    const reservation = {
      id: "res1",
      montantTotalReservation: 1000,
      montantCommission: 100,
      residence: "residence1",
      dateDebut: new Date("2025-08-10"),
    };

    const residence = {
      proprietaire: "user1",
    };

    mockReservationRepository.findOne.mockResolvedValue(reservation);
    mockResidenceRepository.findOne.mockResolvedValue(residence);
    mockWalletService.creditWallet.mockResolvedValue({ walletId: "w1" });

    await handler.reservationWalletCredit("res1", PaymentMethod.Ecobank);

    expect(mockWalletService.creditWallet).toHaveBeenCalledWith(
      "user1",
      900, // montantTotalReservation - montantCommission
      TransactionSource.RESERVATION,
      "res1",
      expect.any(Date),
    );

    expect(mockNotificationService.sendNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user1",
        subject: "texte traduit",
        message: "texte traduit",
        sendSms: true,
      }),
    );
  });

  it("ne fait rien si la réservation est introuvable", async () => {
    mockReservationRepository.findOne.mockResolvedValue(null);

    await handler.reservationWalletCredit("unknown", PaymentMethod.Ecobank);

    expect(mockWalletService.creditWallet).not.toHaveBeenCalled();
    expect(mockNotificationService.sendNotification).not.toHaveBeenCalled();
  });

  it("ne fait rien si le montant est inférieur à 90% du total", async () => {
    mockReservationRepository.findOne.mockResolvedValue({
      montantTotalReservation: 1000,
    });

    await handler.reservationWalletCredit("res2", PaymentMethod.Ecobank); // < 900

    expect(mockWalletService.creditWallet).not.toHaveBeenCalled();
    expect(mockNotificationService.sendNotification).not.toHaveBeenCalled();
  });

  it("ne fait rien si la résidence est introuvable", async () => {
    const reservation = {
      montantTotalReservation: 1000,
      montantCommission: 100,
      residence: "residence1",
      dateDebut: new Date(),
    };

    mockReservationRepository.findOne.mockResolvedValue(reservation);
    mockResidenceRepository.findOne.mockResolvedValue(null);

    await handler.reservationWalletCredit("res3", PaymentMethod.Ecobank);

    expect(mockWalletService.creditWallet).not.toHaveBeenCalled();
  });

  it("ne crédite pas si montant à reverser <= 0", async () => {
    const reservation = {
      montantTotalReservation: 100,
      montantCommission: 150,
      residence: "residence1",
      dateDebut: new Date(),
    };

    mockReservationRepository.findOne.mockResolvedValue(reservation);
    mockResidenceRepository.findOne.mockResolvedValue({
      proprietaire: "user1",
    });

    await handler.reservationWalletCredit("res4", PaymentMethod.Ecobank);

    expect(mockWalletService.creditWallet).not.toHaveBeenCalled();
  });

  it("n’envoie pas de notification si le crédit échoue", async () => {
    const reservation = {
      id: "res1",
      montantTotalReservation: 1000,
      montantCommission: 100,
      residence: "residence1",
      dateDebut: new Date(),
    };

    const residence = {
      proprietaire: "user1",
    };

    mockReservationRepository.findOne.mockResolvedValue(reservation);
    mockResidenceRepository.findOne.mockResolvedValue(residence);
    mockWalletService.creditWallet.mockResolvedValue(null);

    await handler.reservationWalletCredit("res5", PaymentMethod.Ecobank);

    expect(mockNotificationService.sendNotification).not.toHaveBeenCalled();
  });
});
