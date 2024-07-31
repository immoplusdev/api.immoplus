import { Inject, Injectable } from "@nestjs/common";
import { IfAnyOrNever, IGlobalizationService, PathValue, TranslateOptions } from "@/core/domain/globalization";
import { I18nService } from "nestjs-i18n";


@Injectable()
export class GlobalizationService implements IGlobalizationService {
  private readonly i18n: I18nService;

  constructor(i18n: I18nService) {
    this.i18n = i18n;
  }

  t<P extends never, R = PathValue<any, P>>(key: P, options?: TranslateOptions): IfAnyOrNever<R, string, R> {
    return this.i18n.t(key as string, options);
  }
}
