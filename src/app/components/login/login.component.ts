import { Files, IFile } from '../../common/file';

import { ApiService } from '../../services/api';
import { Component } from '@angular/core';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    constructor(private api: ApiService) {}
    public head: MenuEntry = {
        icon: 'home',
        name: 'Home'
    };

    public signInWith(provider: string) {
        this.api.signInWith(provider);
    }
}
