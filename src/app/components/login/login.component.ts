import { ApiService, Provider } from '../../services/api';
import { Files, IFile } from '../../common/file';

import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    constructor(private api: ApiService) {}
    public providers: Provider[];

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
}
