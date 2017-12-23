import { ActivatedRoute, Router } from '@angular/router';
import {
    Component,
    ElementRef,
    EventEmitter,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    DataSourceColumn,
    DataSourceFactory,
    ListDataSource
} from '../../services/data-source-wrapper';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { array, clone, toNumber } from '../../common/helper';

import { ConfigurationService } from '../../services/configuration';
import { Http } from '@angular/http';
import { MatPaginator } from '@angular/material';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';
import { OverviewValue } from '../../common/api';

@Component({
    selector: 'budget-list',
    templateUrl: 'budget-list.component.html',
    styleUrls: ['budget-list.component.css']
})
export class BudgetListComponent implements OnInit {
    public columns: DataSourceColumn[] = [
        { key: 'name', name: 'name', type: 'text' },
        { key: 'value', name: 'amount', type: 'number' },
        { key: 'startYear', name: 'startYear', type: 'number' },
        { key: 'endYear', name: 'endYear', type: 'number' }
    ];

    public dataSource: DataSourceFactory<any, any>;
    public head: MenuEntry = {};

    private url = `/api/data/budgets`;
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
        this.dataSource = ref => new ListDataSource(this.getData(), ref);
    }

    private getData(): Observable<OverviewValue[]> {
        return this.http
            .get(this.url)
            .map(x => x.json())
            .map((x: OverviewValue[]) => x);
    }

    public selected(row: OverviewValue) {
        this.router.navigate(['budgets', row.id]);
    }
}
