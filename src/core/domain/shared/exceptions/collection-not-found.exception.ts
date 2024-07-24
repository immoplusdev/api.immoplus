import { BaseException } from './base.exception';

export class CollectionNotFoundException extends BaseException {
  constructor() {
    super(`Collection non trouvée`, 404);
  }
}
