import { ApiService, Provider } from '../../services/api';

import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { NgForm } from '@angular/forms';
import { CustomErrorStateMatcher } from '../../services/custom-error-state-matcher';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    constructor(private api: ApiService) {}
    public providers: Provider[];
    public login = {
        email: '',
        password: '',
        rememberMe: false
    };

    ngOnInit(): void {
        this.api.getProviders().subscribe(x => (this.providers = x));
    }

    public head: MenuEntry = {
        icon: 'home',
        name: 'Home'
    };

    public signInWith(provider: string) {
        this.api.signInWith(provider);
    }

    public register(): void {
        this.api.register(this.login.email, this.login.password);
    }

    public signIn(): void {
        this.api.signIn(
            this.login.email,
            this.login.password,
            this.login.rememberMe
        );
    }
}
