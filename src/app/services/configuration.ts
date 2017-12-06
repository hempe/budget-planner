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

    public setColor(path?: string) {
        let color = this.getColor(path);
        let addon = 60;
        this._color = `rgba(${hexToRgb(color)
            .map(x => (x + addon < 255 ? x + addon : 255))
            .join(',')}, 0.6)`;
    }

    public resetColor() {
        this._color = `rgba(${hexToRgb(this.getColor()).join(',')}, 0.6)`;
    }

    public getIcon(type?: string) {
        switch (type) {
            case 'assets.positiv':
            case 'assets.negativ':
            case 'revenue.positiv':
            case 'revenue.negativ':
                return 'assessment';
            default:
                return 'home';
        }
    }

    public getName(type?: string) {
        switch (type) {
            case 'assets.positiv':
                return 'Assets';
            case 'assets.negativ':
                return 'Debts';
            case 'revenue.positiv':
                return 'Revenue';
            case 'revenue.negativ':
                return 'Expenses';
            case 'budgets':
            case 'budgets.positiv':
            case 'budgets.negativ':
                return 'Budget';
            default:
                return 'Home';
        }
    }

    public getColor(type?: string) {
        switch (type) {
            case 'assets.positiv':
                return '#66bb6a';
            case 'assets.negativ':
                return '#ef5350';
            case 'revenue.positiv':
                return '#26a69a';
            case 'revenue.negativ':
                return '#ff7043';
            case 'budgets':
            case 'budgets.positiv':
            case 'budgets.negativ':
                return '#26c6da';
            default:
                return '#BAEC8E';
        }
    }
}
