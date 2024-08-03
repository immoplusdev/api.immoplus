import { OmitMethods } from '@/lib/ts-utilities';

export class PublicConfigItem {
  text: string;
  value: string;
  constructor(data?: OmitMethods<PublicConfigItem>) {
    if(data) Object.assign(this, data);
  }
}
