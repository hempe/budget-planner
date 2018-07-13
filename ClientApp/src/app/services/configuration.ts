import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Profile } from '../common/api';
import { hexToRgb, makeid } from '../common/helper';

export const Colors = {
    Amber: '#FFCA28',
    Blue: '#42A5F5',
    Blue_Grey: '#78909C',
    Brown: '#8D6E63',
    Cyan: '#26c6da',
    Deep_Orange: '#ff7043',
    Deep_Purple: '#7E57C2',
    Green: '#66bb6a',
    Grey: '#BDBDBD',
    Indigo: '#5C6BC0',
    Light_Blue: '#29B6F6',
    Light_Green: '#9CCC65',
    Lime: '#D4E157',
    Orange: '#FFA726',
    Pink: '#EC407A',
    Purple: '#AB47BC',
    Red: '#ef5350',
    Teal: '#26a69a',
    Yellow: '#FFEE58'
};

@Injectable()
export class ConfigurationService {
    constructor(private translateService: TranslateService) {
        this.resetColor();
    }
    public get language(): string {
        let userLang = this.profile ? this.profile.language : undefined;
        userLang =
            userLang || navigator.language || (<any>navigator).userLanguage;
        return userLang.split('-')[0];
    }

    public loggedIn: boolean;
    public username: string;

    private _avatar: string = '/assets/img/avatars/noavatar.png';
    public set avatar(val: string) {
        if (val) {
            val = val.split('?id=')[0];
            this._avatar = `${val}?q=${makeid()}`;
        } else {
            this._avatar = '/assets/img/avatars/noavatar.png';
        }
    }

    public get avatar(): string {
        return this._avatar;
    }
    private _profile: Profile;
    public get profile(): Profile {
        return this._profile;
    }
    public set profile(v: Profile) {
        this._profile = v;
        if (v.color) this.fallback = v.color;
    }

    public get color() {
        return this._color;
    }

    private _color: string;

    private fallback = Colors.Cyan; //'#BAEC8E';
    public setCustomColor(color: string) {
        this.fallback = color;
        this.resetColor();
    }

    public setColor(path?: string) {
        let color = this.getColor(path);
        let addon = 60;
        try {
            this._color = `rgba(${hexToRgb(color)
                .map(x => (x + addon < 255 ? x + addon : 255))
                .join(',')}, 0.6)`;
        } catch (err) {
            return color;
        }
    }

    public resetColor() {
        this.setColor();
        //this._color = `rgba(${hexToRgb(this.getColor()).join(',')}, 0.6)`;
    }

    public getIcon(...path: string[]) {
        let type = this.flatten(path);
        switch (type) {
            case 'assets':
            case 'assets.positive':
            case 'assets.negative':
            case 'revenue':
            case 'revenue.positive':
            case 'revenue.negative':
                return 'assessment';
            case 'budgets':
                return 'trending_up';
            default:
                return 'home';
        }
    }

    public getTranslatedName(...path: string[]): string {
        return this.translateService.instant(this.getName.apply(this, path));
    }

    public getName(...path: string[]) {
        let type = this.flatten(path);
        switch (type) {
            case 'assets':
            case 'assets.positive':
                return 'Assets';
            case 'assets.negative':
                return 'Debts';
            case 'revenue':
            case 'revenue.positive':
                return 'PlannedRevenue';
            case 'revenue.negative':
                return 'PlannedExpenses';
            case 'budgets':
                return 'Budget';
            case 'budgets.positive':
                return 'Income';
            case 'budgets.negative':
                return 'Expenses';

            default:
                return 'Home';
        }
    }

    public getColor(...path: string[]) {
        let type = this.flatten(path);
        switch (type) {
            //case 'assets':
            case 'assets.positive':
                return Colors.Green;
            case 'assets.negative':
                return Colors.Red;
            //case 'revenue':
            case 'revenue.positive':
                return Colors.Teal;
            case 'revenue.negative':
                return Colors.Deep_Orange;
            //case 'budgets':
            case 'budgets.positive':
                return Colors.Blue; //Colors.Cyan;
            case 'budgets.negative':
                return Colors.Orange;
            default:
                return this.fallback;
            //return Colors.Deep_Purple;
            //return '#BAEC8E';
        }
    }

    private flatten(path: any): string {
        return path && typeof path != 'string'
            ? (<string[]>path).join('.')
            : path;
    }
}
