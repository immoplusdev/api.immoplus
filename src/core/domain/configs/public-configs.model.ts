import { OmitMethods } from "@/lib/ts-utilities";
import { AppConfigs } from "@/core/domain/configs/app-configs.model";
import { PublicConfigItem } from "@/core/domain/configs/public-config-item.model";

export class PublicConfigs extends AppConfigs {
  productTypes: PublicConfigItem[];
  galleryGroups: PublicConfigItem[];
  visitPaymentTypes: PublicConfigItem[];
  servicePaymentTypes: PublicConfigItem[];
  orderPaymentTypes: PublicConfigItem[];
  shippingTypes: PublicConfigItem[];
  paymentStatus: PublicConfigItem[];
  serviceStatus: PublicConfigItem[];
  shippingStatus: PublicConfigItem[];
  categoryPaymentTypes: PublicConfigItem[];
  languages: PublicConfigItem[];
  defaultStatus: PublicConfigItem[];
  categories: PublicConfigItem[];

  constructor(data?: OmitMethods<PublicConfigs>) {
    if (data) super(data);
  }
}
