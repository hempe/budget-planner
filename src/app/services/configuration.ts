import { Injectable } from '@angular/core';

@Injectable()
export class ConfigurationService {
    public get language(): string {
        let userLang = navigator.language || (<any>navigator).userLanguage;
        return userLang.split('-')[0];
    }

    public loggedIn: boolean;
    public username: string;
}
