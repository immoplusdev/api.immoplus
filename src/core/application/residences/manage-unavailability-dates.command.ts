import { OmitMethods } from "@/lib/ts-utilities";

export enum UnavailabilityAction {
  Add = "add",
  Remove = "remove",
}

export class ManageUnavailabilityDatesCommand {
  residenceId: string;
  userId: string;
  isAdmin: boolean;
  action: UnavailabilityAction;
  dates: string[];

  constructor(data?: OmitMethods<ManageUnavailabilityDatesCommand>) {
    if (data) Object.assign(this, data);
  }
}
