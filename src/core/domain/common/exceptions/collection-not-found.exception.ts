import { BaseException } from "@/core/domain/common/exceptions";

export class CollectionNotFoundException extends BaseException {
  constructor() {
    super(`$t:all.exception.collection_not_found`, 404);
  }
}
