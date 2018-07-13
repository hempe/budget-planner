import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ConfigurationService } from './configuration';
import { map } from 'rxjs/operators';

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
        private configuration: ConfigurationService,
        private snackBar: MatSnackBar,
        private translateService: TranslateService
    ) {}

    public signIn(email: string, password: string, rememberMe?: boolean) {
        this.http
            .post('/.auth/signin', {
                email: email,
                password: password,
                rememberMe: rememberMe || false
            })
            .subscribe(x => this.init());
    }

    public register(email: string, password: string) {
        this.http
            .post('/.auth/register', {
                email: email,
                password: password
            })
            .subscribe(x => this.init());
    }
    public reset(email: string, password: string, code: string) {
        this.http
            .post('/.auth/reset', {
                email: email,
                password: password,
                code: code
            })
            .subscribe(x => {
                window.location.href = `/`;
            });
    }

    public forgot(email: string) {
        this.http
            .post('/.auth/forgot', {
                email: email,
                language: this.configuration.language
            })
            .subscribe(
                () => {},
                () => {},
                () => {
                    this.translateService
                        .get('RegisterEmailSend')
                        .subscribe(x => {
                            this.snackBar.open(x, undefined, {
                                duration: 3000
                            });
                        });
                }
            );
    }
    public signInWith(provider: string): void {
        window.location.href = `.auth/signin/${provider}?returnUrl=${
            window.location.pathname
        }`;
    }

    public getProviders(): Observable<Provider[]> {
        return this.http.get('/.auth').pipe(
            map(x => x.json()),
            map((x: { name: string; displayName: string }[]) =>
                x.map(
                    y =>
                        <Provider>{
                            name: y.name,
                            displayName: y.displayName,
                            key: y.name.toLowerCase()
                        }
                )
            )
        );
    }

    public signOut() {
        window.location.href = '/.auth/signout';
    }

    public init(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.translate.setDefaultLang('en');
            this.http
                .get('.auth/self')
                .pipe(map(x => x.json()))
                .subscribe(
                    x => {
                        x = x ? x : {};
                        this.configuration.loggedIn = x.loggedIn;
                        this.configuration.username = x.userName;
                        this.http
                            .get('/api/profile')
                            .pipe(map(y => y.json()))
                            .subscribe(
                                y => {
                                    this.configuration.profile = y;
                                    this.http
                                        .get('/api/profile/image')
                                        .pipe(map(z => z.json()))
                                        .subscribe(
                                            uri => {
                                                this.configuration.avatar = uri
                                                    ? uri.uri
                                                    : undefined;
                                                resolve(true);
                                            },
                                            e => resolve(true)
                                        );
                                },
                                ex => resolve(true),
                                () =>
                                    this.translate.use(
                                        this.configuration.language
                                    )
                            );
                    },
                    err => {
                        resolve(true);
                    }
                );
        });
    }
}
