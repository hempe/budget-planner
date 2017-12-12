import { ConfigurationService } from './configuration';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

export interface Provider {
    name: string;
    displayName: string;
    key: string;
}
@Injectable()
export class ApiService {
    constructor(
        private translate: TranslateService,
        private http: Http,
        private configuration: ConfigurationService
    ) {}

    public signInWith(provider: string): void {
        window.location.href = `.auth/signin/${provider}?returnUrl=${
            window.location.pathname
        }`;
    }

    public getProviders(): Observable<Provider[]> {
        return this.http
            .get('/.auth')
            .map(x => x.json())
            .map((x: { name: string; displayName: string }[]) =>
                x.map(
                    y =>
                        <Provider>{
                            name: y.name,
                            displayName: y.displayName,
                            key: y.name.toLowerCase()
                        }
                )
            );
    }

    public signOut() {
        window.location.href = '/.auth/signout';
    }

    public init(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.translate.setDefaultLang('en');
            this.translate.use(this.configuration.language);

            return this.http
                .get('.auth/self')
                .map(x => x.json())
                .subscribe(
                    x => {
                        x = x ? x : {};
                        this.configuration.loggedIn = x.loggedIn;
                        this.configuration.username = x.userName;
                        resolve(true);
                    },
                    err => {
                        resolve(true);
                    }
                );
        });
    }
}
