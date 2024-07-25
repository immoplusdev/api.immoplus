import { BaseException } from "@/core/domain/shared/exceptions";

export class CollectionNotFoundException extends BaseException {
  constructor() {
    super(`Collection non trouvée`, 404);
  }
}
