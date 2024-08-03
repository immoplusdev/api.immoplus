import { OmitMethods } from '@/lib/ts-utilities';

export class AppConfigs {
  id: string;
  websiteUrl: string;
  normalVisitPrice: number;
  expressVisitPrice: number;
  projectName: string;
  projectUrl: string;
  projectLogo: string;
  smsSenderName: string;
  proximityRadius: number;
  standardShippingPrice: number;
  flashShippingPrice: number;
  contactEmail: string;
  contactPhoneNumber: string;

  constructor(data?: OmitMethods<AppConfigs>) {
    if(data) Object.assign(this, data);
  }
}
