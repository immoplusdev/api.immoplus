import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import {
  ManageUnavailabilityDatesCommand,
  UnavailabilityAction,
} from "./manage-unavailability-dates.command";
import { IResidenceRepository, Residence } from "@/core/domain/residences";
import { Inject } from "@nestjs/common";
import { Deps } from "@/core/domain/common/ioc";
import { ItemNotFoundException } from "@/core/domain/common/exceptions";
import { AccessForbiddenException } from "@/core/domain/auth";
import { ServiceDate } from "@/core/domain/common/models/service-date.model";

@CommandHandler(ManageUnavailabilityDatesCommand)
export class ManageUnavailabilityDatesCommandHandler implements ICommandHandler<ManageUnavailabilityDatesCommand> {
  constructor(
    @Inject(Deps.ResidenceRepository)
    private readonly repository: IResidenceRepository,
  ) {}

  async execute(command: ManageUnavailabilityDatesCommand): Promise<Residence> {
    const residence = await this.repository.findOne(command.residenceId);

    this.verifyCanProceed(command, residence);

    const currentDates = residence.datesReservation || [];

    let updatedDates: ServiceDate[];

    if (command.action === UnavailabilityAction.Add) {
      updatedDates = this.addDates(currentDates, command.dates);
    } else {
      updatedDates = this.removeDates(currentDates, command.dates);
    }

    await this.repository.updateOne(command.residenceId, {
      datesReservation: updatedDates,
    });

    return await this.repository.findOne(command.residenceId);
  }

  private verifyCanProceed(
    command: ManageUnavailabilityDatesCommand,
    residence: Residence,
  ): void {
    if (!residence) {
      throw new ItemNotFoundException();
    }

    // Vérifier que l'utilisateur est le propriétaire ou un admin
    if (!command.isAdmin && residence.proprietaire !== command.userId) {
      throw new AccessForbiddenException();
    }
  }

  private addDates(
    currentDates: ServiceDate[],
    newDates: string[],
  ): ServiceDate[] {
    const existingDateStrings = new Set(
      currentDates.map((d) => this.normalizeDate(d.date)),
    );

    const datesToAdd = newDates
      .filter(
        (dateStr) => !existingDateStrings.has(this.normalizeDate(dateStr)),
      )
      .map((dateStr) => new ServiceDate({ date: new Date(dateStr) }));

    return [...currentDates, ...datesToAdd];
  }

  private removeDates(
    currentDates: ServiceDate[],
    datesToRemove: string[],
  ): ServiceDate[] {
    const datesToRemoveSet = new Set(
      datesToRemove.map((d) => this.normalizeDate(d)),
    );

    return currentDates.filter(
      (d) => !datesToRemoveSet.has(this.normalizeDate(d.date)),
    );
  }

  private normalizeDate(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  }
}
