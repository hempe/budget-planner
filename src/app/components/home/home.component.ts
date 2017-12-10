import { Color, Colors } from 'ng2-charts';
import { Component, HostListener } from '@angular/core';
import { Files, IFile, IGroup, OverviewValue } from '../../common/file';
import { array, numberWithSeperator } from '../../common/helper';

import { ConfigurationService } from '../../services/configuration';
import { FileService } from '../../services/file-service';
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

    public assets: OverviewValue;
    public revenue: OverviewValue;
    public budgets: OverviewValue[];

    constructor(
        private router: Router,
        private http: Http,
        private config: ConfigurationService
    ) {
        this.config.resetColor();
    }

    ngOnInit(): void {
        this.http
            .get(`/api/data/assets`)
            .map(x => x.json())
            .subscribe(x => (this.assets = x));

        this.http
            .get(`/api/data/revenue`)
            .map(x => x.json())
            .subscribe(x => (this.revenue = x));

        this.http
            .get(`/api/data/budgets`)
            .map(x => x.json())
            .subscribe(x => (this.budgets = x));
    }

    public budget(id: number) {
        this.router.navigate(['budgets', id]);
    }
    public edit(path: any, tab: string) {
        let route = [].concat(path.split('.'));
        if (tab) route.push(<any>{ tab: tab });
        this.router.navigate(route);
    }
}
