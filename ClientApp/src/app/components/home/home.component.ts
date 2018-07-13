import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { Colors, ConfigurationService } from '../../services/configuration';
import { DashboardConfig } from '../dashboard/dashboard';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';
import { map } from 'rxjs/operators';

@Component({
    selector: 'home',
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    public head: MenuEntry = {
        icon: 'home',
        name: 'Home'
    };

    public items: DashboardConfig[];
    public colors: { name: string; value: string }[];
    public color: undefined;

    public setCustomColor() {
        this.config.setCustomColor(this.color);
    }

    constructor(
        private router: Router,
        private http: Http,
        private config: ConfigurationService
    ) {
        this.config.resetColor();
        this.colors = Object.keys(Colors).map(x => {
            return {
                name: x,
                value: Colors[x]
            };
        });
    }

    ngOnInit(): void {
        this.http
            .get('/api/dashboard')
            .pipe(map(x => x.json()))
            .subscribe(x => (this.items = x));
    }
}
