import { Injectable } from '@angular/core';
import {
    MissingTranslationHandler,
    MissingTranslationHandlerParams
} from '@ngx-translate/core';

@Injectable()
export class WarnMissingTranslationHandler extends MissingTranslationHandler {
    handle(params: MissingTranslationHandlerParams) {
        return `##${params.key}##`;
    }
}
