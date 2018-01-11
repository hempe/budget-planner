import { Colors, ConfigurationService } from '../../services/configuration';
import { Component, HostListener } from '@angular/core';
import { Group, OverviewValue } from '../../common/api';
import { array, numberWithSeperator } from '../../common/helper';

import { Color } from 'ng2-charts';
import { DashboardConfig } from '../dashboard/dashboard';
import { Http } from '@angular/http';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';
import { MouseService } from '../../services/mouse';
import { Router } from '@angular/router';

@Component({
    selector: 'home',
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    public head: MenuEntry = {
        icon: 'home',
        name: 'Home'
    };

    public colors: { name: string; value: string }[];
    public color: undefined;

    public setCustomColor() {
        this.config.setCustomColor(this.color);
    }

    public items: DashboardConfig[];
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
            .map(x => x.json())
            .subscribe(x => (this.items = x));
    }
}
