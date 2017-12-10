import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
    FrequencyValue,
    IClient,
    IGroup,
    OverviewValue
} from '../../common/file';
import { Observable, Subject } from 'rxjs';
import { array, clone, toNumber } from '../../common/helper';

import { ConfigurationService } from '../../services/configuration';
import { FileService } from '../../services/file-service';
import { Http } from '@angular/http';
import { MatPaginator } from '@angular/material';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';

@Component({
    selector: 'budget',
    templateUrl: 'budget.component.html',
    styleUrls: ['budget.component.css']
})
export class BudgetComponent implements OnInit {
    public head: MenuEntry = {};

    private budget: OverviewValue;
    private id: string;
    private url: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private config: ConfigurationService,
        private http: Http
    ) {
        this.head = {
            icon: 'arrow_back',
            name: this.config.getName('budgets'),
            action: () =>
                this.router.navigate(['../'], { relativeTo: this.route })
        };

        this.config.setColor('budgets');
    }
    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.url = `/api/data/budgets/${this.id}`;
        this.getData().subscribe(x => (this.budget = x));
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
    /*
    public selected(row: OverviewValue) {
        this.router.navigate(['budgets', row.id]);
    }
    */
}
