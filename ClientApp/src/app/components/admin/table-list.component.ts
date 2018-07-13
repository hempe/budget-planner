import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../../services/configuration';
import {
    DataSourceColumn,
    DataSourceFactory,
    ListDataSource
} from '../../services/data-source-wrapper';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';
import { map } from 'rxjs/operators';

@Component({
    selector: 'table-list',
    templateUrl: 'table-list.component.html',
    styleUrls: ['table-list.component.css']
})
export class TableListComponent implements OnInit, OnDestroy {
    public columns: DataSourceColumn[] = [
        { key: 'name', name: 'name', type: 'text' }
    ];

    public dataSource: DataSourceFactory<any, any>;
    public head: MenuEntry = {};
    private _data: { name: string }[] = undefined;
    private data: EventEmitter<{ name: string }[]> = new EventEmitter<any>();

    private url = `/api/admin/tables`;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private config: ConfigurationService,
        private http: Http
    ) {
        this.head = {
            icon: 'arrow_back',
            name: this.config.getName('admin'),
            action: () =>
                this.router.navigate(['../'], { relativeTo: this.route })
        };

        this.config.setColor('admin');
    }

    ngOnInit() {
        this.dataSource = ref => new ListDataSource(this.getData(), ref);
    }

    ngOnDestroy(): void {}

    private getData(): Observable<{ name: string }[]> {
        this.http
            .get(this.url)
            .pipe(
                map(x => x.json()),
                map((x: string[]) => x.map(c => <any>{ name: c }))
            )
            .subscribe(x => {
                this._data = x;
                this.data.emit(this._data);
            });
        return this.data.asObservable();
    }

    public selected(row: { name: string }) {
        this.router.navigate(['admin', row.name]);
    }
}
