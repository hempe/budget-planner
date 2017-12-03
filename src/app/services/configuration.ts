import { Injectable } from '@angular/core';
import { hexToRgb } from '../common/helper';
import { retry } from 'rxjs/operator/retry';
@Injectable()
export class ConfigurationService {
    constructor() {
        this.resetColor();
    }
    public get language(): string {
        let userLang = navigator.language || (<any>navigator).userLanguage;
        return userLang.split('-')[0];
    }

    public loggedIn: boolean;
    public username: string;
    public get color() {
        return this._color;
    }
    private _color: string;

    public setColor(color: string) {
        let addon = 60;
        this._color = `rgba(${hexToRgb(color)
            .map(x => (x + addon < 255 ? x + addon : 255))
            .join(',')},0.6)`;
    }
    public resetColor() {
        this._color = 'rgba(186, 236, 142, 0.6)';
    }
}
