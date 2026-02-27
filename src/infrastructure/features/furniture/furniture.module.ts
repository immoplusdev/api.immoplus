import { Module, Provider } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { Deps } from "@/core/domain/common/ioc";
import { TypeormModule } from "@/infrastructure/typeorm";
import { FurnitureRepository } from "./furniture.repository";
import { FurnitureController } from "./furniture.controller";
import { CreateFurnitureCommandHandler } from "@/core/application/furniture";
import { UserModule } from "@/infrastructure/features/users";
import { NoContactInfoConstraint } from "@/infrastructure/decorators/no-contact-info.validator";

const queryHandlers = [];
const commandHandlers = [CreateFurnitureCommandHandler];
const eventHandlers = [];

const providers: Provider[] = [
  {
    provide: Deps.FurnitureRepository,
    useClass: FurnitureRepository,
  },
];

@Module({
  controllers: [FurnitureController],
  imports: [TypeormModule, CqrsModule, UserModule],
  providers: [
    ...providers,
    ...queryHandlers,
    ...commandHandlers,
    ...eventHandlers,
    NoContactInfoConstraint,
  ],
  exports: [...providers, NoContactInfoConstraint],
})
export class FurnitureModule {}
