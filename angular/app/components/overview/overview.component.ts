import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DashboardConfig, Themes } from '../dashboard/dashboard';
import { FormControl, FormGroup } from '@angular/forms';
import {
    FrequencyValue,
    Group,
    OverviewValue,
    Profile
} from '../../common/api';
import { Observable, Subject } from 'rxjs';
import { array, clone, toNumber } from '../../common/helper';

import { ConfigurationService } from '../../services/configuration';
import { Http } from '@angular/http';
import { MatPaginator } from '@angular/material';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';
import { ThemeSelector } from '../theme-selector/theme-selector.component';

@Component({
    selector: 'overview',
    templateUrl: 'overview.component.html',
    styleUrls: ['overview.component.css']
})
export class OverviewComponent implements OnInit {
    public head: MenuEntry = {};
    public theme: string = undefined;
    private value: OverviewValue;
    private type: string;
    private url: string;
    private name: string;
    private positive: string;
    private negative: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private config: ConfigurationService,
        private http: Http,
        private themeSelector: ThemeSelector
    ) {}
    ngOnInit() {
        this.type = this.route.snapshot.data.type;

        this.head = {
            icon: 'arrow_back',
            name: this.config.getName(this.type),
            action: () =>
                this.router.navigate(['../'], { relativeTo: this.route })
        };

        this.http
            .get(`/api/data/dashboard/${this.type}`)
            .map(x => x.json())
            .subscribe(x => (this.theme = x.theme));

        this.name = this.config.getTranslatedName(this.type);
        this.positive = this.config.getTranslatedName(`${this.type}.positive`);
        this.negative = this.config.getTranslatedName(`${this.type}.negative`);
        this.config.setColor(this.type);
        this.url = `/api/data/${this.type}`;
        this.getData().subscribe(x => (this.value = x));
    }

    public goto(path: string, tab: string) {
        this.router.navigate([this.type, path, { tab: tab }]);
    }

    public pin() {
        if (this.theme)
            this.http
                .delete(`/api/data/dashboard/${this.type}`)
                .subscribe(x => (this.theme = undefined));
        else
            this.themeSelector.selectTheme().subscribe(theme => {
                this.http
                    .post('/api/data/dashboard', <DashboardConfig>{
                        path: this.type,
                        theme: theme,
                        type: 'bar'
                    })
                    .map(x => x.json())
                    .subscribe(x => (this.theme = x.theme));
            });
    }

    private getData(): Observable<OverviewValue> {
        return this.http
            .get(this.url)
            .map(x => x.json())
            .map((x: OverviewValue) => x);
    }
}
