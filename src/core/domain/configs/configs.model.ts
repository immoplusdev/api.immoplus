import { OmitMethods } from '@/lib/ts-utilities';

export class Config {
  constructor(data?: OmitMethods<Config>) {
    if(data) Object.assign(this, data);
  }
}
