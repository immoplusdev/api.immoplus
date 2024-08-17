import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateUserAdditionalDataCommand } from "./update-user-additional-data.command";
import { UpdateUserAdditionalDataCommandResponse } from "./update-user-additional-data-command.response";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/shared/ioc";
import { IUserDataRepository, IUserRepository, User, UserNotFoundException } from "@/core/domain/users";
import { AccountDataAlreadyVerifiedException } from "@/core/domain/users/account-data-already-verified.exception";
import { omitObjectProperties } from "@/lib/ts-utilities";

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
    if (!user) throw new UserNotFoundException();

    this.ensureAccountDataNotVerified(user);

    const additionalDataId = (user.additionalData as User).id;
    const additionalData = await this.usersDataRepository.findOne(additionalDataId);

    await this.usersDataRepository.updateOne(
      additionalDataId,
      {
        ...omitObjectProperties(additionalData, ["userId"]),
        // Pro particulier
        lieuNaissance: command.lieuNaissance || undefined,
        activite: command.activite || undefined,
        photoIdentite: command.photoIdentite || undefined,
        pieceIdentite: command.pieceIdentite || undefined,

        // Pro entreprise
        nomEntreprise: command.nomEntreprise || undefined,
        emailEntreprise: command.emailEntreprise || undefined,
        registreCommerce: command.registreCommerce || undefined,
        numeroContribuable: command.numeroContribuable || undefined,
        typeEntreprise: command.typeEntreprise || undefined,
      });

    return await this.usersDataRepository.findOne(additionalDataId) as never;
  }

  private ensureAccountDataNotVerified(user: User) {
    if (user.identityVerified) throw new AccountDataAlreadyVerifiedException();
  }
}
