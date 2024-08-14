import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateUserAdditionalDataCommand } from "./update-user-additional-data.command";
import { UpdateUserAdditionalDataCommandResponse } from "./update-user-additional-data-command.response";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { IUserDataRepository, IUserRepository, User } from "@/core/domain/users";
import { AccountDataAlreadyVerifiedException } from "@/core/domain/users/account-data-already-verified.exception";

@CommandHandler(UpdateUserAdditionalDataCommand)
export class UpdateUserAdditionalDataCommandHandler implements ICommandHandler<UpdateUserAdditionalDataCommand> {
  constructor(
    @Inject(Deps.UsersRepository)
    private readonly usersRepository: IUserRepository,
    @Inject(Deps.UsersDataRepository)
    private readonly usersDataRepository: IUserDataRepository,
  ) {
    //
  }

  async execute(command: UpdateUserAdditionalDataCommand): Promise<UpdateUserAdditionalDataCommandResponse> {

    const user = await this.usersRepository.findOne(command.userId);

    this.ensureAccountDataNotVerified(user);

    const additionalDataId = (user.additionalData as User).id;

    await this.usersDataRepository.updateOne(
      additionalDataId,
      {
        // Pro particulier
        lieuNaissance: command.lieuNaissance,
        activite: command.activite,
        photoIdentite: command.photoIdentite,
        pieceIdentite: command.pieceIdentite,

        // Pro entreprise
        nomEntreprise: command.nomEntreprise,
        emailEntreprise: command.emailEntreprise,
        registreCommerce: command.registreCommerce,
        numeroContribuable: command.numeroContribuable,
        typeEntreprise: command.typeEntreprise,
      });

    return await this.usersDataRepository.findOne(additionalDataId) as never;
  }

  private ensureAccountDataNotVerified(user: User) {
    if (user.identityVerified) throw new AccountDataAlreadyVerifiedException();
  }
}
