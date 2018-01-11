import { ActivatedRoute, Router } from '@angular/router';
import { BudgetOverview, OverviewValue } from '../../common/api';
import {
    Component,
    ElementRef,
    EventEmitter,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    DataSourceColumn,
    DataSourceFactory,
    ListDataSource
} from '../../services/data-source-wrapper';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { array, clone, guid, toNumber } from '../../common/helper';

import { ConfigurationService } from '../../services/configuration';
import { Http } from '@angular/http';
import { KeyboardService } from '../../services/keyboard';
import { MatPaginator } from '@angular/material';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';

@Component({
    selector: 'budget-list',
    templateUrl: 'budget-list.component.html',
    styleUrls: ['budget-list.component.css']
})
export class BudgetListComponent implements OnInit, OnDestroy {
    public columns: DataSourceColumn[] = [
        { key: 'name', name: 'name', type: 'text' },
        { key: 'value', name: 'amount', type: 'number' },
        { key: 'startYear', name: 'startYear', type: 'number' },
        { key: 'endYear', name: 'endYear', type: 'number' }
    ];

    public dataSource: DataSourceFactory<any, any>;
    public head: MenuEntry = {};
    private _data: BudgetOverview[] = undefined;
    private data: EventEmitter<BudgetOverview[]> = new EventEmitter<any>();

    private url = `/api/budgets`;
    private keyDown: Subscription;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private config: ConfigurationService,
        private keyboardService: KeyboardService,
        private http: Http
    ) {
        this.head = {
            icon: 'arrow_back',
            name: this.config.getName('budgets'),
            action: () =>
                this.router.navigate(['../'], { relativeTo: this.route })
        };

        this.config.setColor('budgets');
        this.keyDown = this.keyboardService.keyDown.subscribe(e => {
            if (this.keyboardService.isInputActive()) return;

            if (e.key == 'Delete') this.delete();
            if (e.key == 'Insert') this.add();
        });
    }

    ngOnInit() {
        this.dataSource = ref => new ListDataSource(this.getData(), ref);
    }

    ngOnDestroy(): void {
        this.keyDown.unsubscribe();
    }

    private getData(): Observable<BudgetOverview[]> {
        this.http
            .get(this.url)
            .map(x => x.json())
            .map((x: BudgetOverview[]) => x)
            .subscribe(x => {
                this._data = x;
                this.data.emit(this._data);
            });
        return this.data.asObservable();
    }

    public add(): void {
        this.router.navigate(['budgets', guid()]);
    }

    public delete(): void {
        console.info('delete');
        for (let i = 0; i < this._data.length; i++) {
            let x = this._data[i];
            if (!x.checked) continue;
            this._data.splice(i, 1);
            this.deleteFromServer(x.id);
            i--;
        }
        this.data.emit(this._data);
    }

    private deleteFromServer(id: string) {
        this.http.delete(`${this.url}/${id}`).subscribe();
    }

    public selected(row: BudgetOverview) {
        this.router.navigate(['budgets', row.id]);
    }
}
