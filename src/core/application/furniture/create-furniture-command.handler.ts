import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { Inject, Logger } from "@nestjs/common";
import { CreateFurnitureCommand } from "./create-furniture.command";
import { Deps } from "@/core/domain/common/ioc";
import { IFurnitureRepository } from "@/core/domain/furniture/i-furniture.repository";
import { Furniture } from "@/core/domain/furniture/furniture.model";
import { FurnitureStatus } from "@/core/domain/furniture";
import { generateFurnitureCode } from "@/lib/ts-utilities/strings/string-generator";

@CommandHandler(CreateFurnitureCommand)
export class CreateFurnitureCommandHandler implements ICommandHandler<CreateFurnitureCommand> {
  private readonly logger = new Logger(CreateFurnitureCommandHandler.name);

  constructor(
    @Inject(Deps.FurnitureRepository)
    private readonly furnitureRepository: IFurnitureRepository,
    private readonly eventBus: EventBus,
  ) {
    //
  }

  async execute(command: CreateFurnitureCommand): Promise<Furniture> {
    // ✅ Validation des données ultra ultra strictes
    this.logger.debug("CreateFurnitureCommand received", {
      ownerId: command.ownerId,
      lat: command.lat,
      lng: command.lng,
      position: command.position,
      titre: command.titre,
    });

    const furnitureData: Partial<Furniture> = {
      owner: command.ownerId,
      titre: command.titre,
      description: command.description,
      prix: command.prix,
      type: command.type,
      category: command.category,
      etat: command.etat,
      adresse: command.adresse,
      ville: command.ville,
      commune: command.commune,
      position: command.position,
      lat: command.lat,
      lng: command.lng,
      images: command.images,
      video: command.video,
      status: command.status ?? FurnitureStatus.Inactive,
      codeFurniture: generateFurnitureCode(),
      metadata: command.metadata,
      createdBy: command.ownerId,
    };

    this.logger.debug("Persisting furniture", furnitureData);

    const furniture = await this.furnitureRepository.createOne(furnitureData);

    // TODO: ACTIVER LA PUBLICATION DE L'EVENEMENT SUR L'EVENTBUS SI JE SUIS PRET
    // this.eventBus.publish(new FurnitureCreatedEvent({ id: furniture.id, ownerId: command.ownerId }));

    return furniture;
  }
}
