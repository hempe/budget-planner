import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import {
    FrequencyValue,
    Group,
    OverviewValue,
    Profile
} from '../../common/file';
import { Observable, Subject } from 'rxjs';
import { array, clone, toNumber } from '../../common/helper';

import { ConfigurationService } from '../../services/configuration';
import { DashboardConfig } from '../dashboard/dashboard';
import { FileService } from '../../services/file-service';
import { Http } from '@angular/http';
import { MatPaginator } from '@angular/material';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';
import { ThemeSelector } from '../theme-selector/theme-selector.component';

@Component({
    selector: 'budget',
    templateUrl: 'budget.component.html',
    styleUrls: ['budget.component.css']
})
export class BudgetComponent implements OnInit {
    public head: MenuEntry = {};

    public type: string = 'budgets';
    public color: string;

    private value: OverviewValue;
    private id: string;
    private url: string;
    private theme: string;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private config: ConfigurationService,
        private http: Http,
        private themeSelector: ThemeSelector
    ) {
        this.head = {
            icon: 'arrow_back',
            name: this.config.getName('budgets'),
            action: () =>
                this.router.navigate(['../'], { relativeTo: this.route })
        };

        this.config.setColor('budgets');
        this.color = this.config.getColor('budgets');
    }
    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.url = `/api/data/${this.type}/${this.id}`;
        this.getData().subscribe(x => (this.value = x));

        this.http
            .get(`/api/data/dashboard/${this.type}/${this.id}`)
            .map(x => x.json())
            .subscribe(x => (this.theme = x.theme));
    }

    public goto(path: string) {
        this.router.navigate(['budgets', this.id, path]);
    }

    private getData(): Observable<OverviewValue> {
        return this.http
            .get(this.url)
            .map(x => x.json())
            .map((x: OverviewValue) => x);
    }

    public pin() {
        if (this.theme)
            this.http
                .delete(`/api/data/dashboard/${this.type}/${this.id}`)
                .subscribe(x => (this.theme = undefined));
        else
            this.themeSelector.selectTheme().subscribe(theme => {
                this.http
                    .post('/api/data/dashboard', <DashboardConfig>{
                        path: this.type,
                        id: Number(this.id),
                        theme: theme,
                        type: 'bar'
                    })
                    .map(x => x.json())
                    .subscribe(x => (this.theme = x.theme));
            });
    }

    public save(form: NgForm): void {
        this.http
            .post(`/api/data/budgets/${this.id}`, this.value)
            .map(x => x.json())
            .subscribe(
                x => this.setValue(x, form),
                err => this.resetForm(form)
            );
    }

    private setValue(x: any, form: NgForm) {
        this.value = clone(x);
        this.resetForm(form);
    }

    private resetForm(form: NgForm) {
        if (form) {
            form.control.markAsUntouched();
            form.control.markAsPristine();
        }
    }
}
