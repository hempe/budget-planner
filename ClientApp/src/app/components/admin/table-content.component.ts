import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigurationService } from '../../services/configuration';
import { DataSourceColumn, DataSourceFactory, ListDataSource } from '../../services/data-source-wrapper';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';

interface Table {
    partitionKey: string;
    rowKey: string;
    table: string;
    data: Map<string, any>;
}
@Component({
    selector: 'table-content',
    templateUrl: 'table-content.component.html',
    styleUrls: ['table-content.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableContentComponent implements OnInit, OnDestroy {
    public columns: DataSourceColumn[] = [];

    public dataSource: Observable<DataSourceFactory<any, any>>;
    public head: MenuEntry = {};
    private _data: Table[] = undefined;
    private data: EventEmitter<Table[]> = new EventEmitter<any>();

    private url = ``;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private config: ConfigurationService,
        private http: Http
    ) {

        this.config.setColor('admin');
    }

    ngOnInit() {
        const table = this.route.snapshot.params['table'];
        const headerUrl = `/api/admin/tables/headers/${table}`;
        this.head = {
            icon: 'arrow_back',
            name: table,
            action: () =>
                this.router.navigate(['../'], { relativeTo: this.route })
        };

        this.dataSource = this.http
            .get(headerUrl)
            .pipe(
                map(x => x.json()),
                map((x: Map<string, any>[]) => {
                this.columns = Object.keys(x).map(
                    c =>
                        <DataSourceColumn>{
                            key: c,
                            name: c,
                            type: 'text'
                        }
                );

                this.url = `/api/admin/tables/${table}`;
                console.info('and the url is ', this.url);
                return ref => new ListDataSource(this.getData(), ref);
            }));
    }

    ngOnDestroy(): void {}

    private getData(): Observable<Table[]> {
        this.http
            .get(this.url)
            .pipe(map(x => x.json()))
            .subscribe(x => {
                this._data = x.map(c =>
                    Object.assign(
                        {
                            rowKey: c.rowKey,
                            partitionKey: c.partitionKey,
                            table: c.table
                        },
                        c.data
                    )
                );
                console.info(this._data);
                this.data.emit(this._data);
            });
        return this.data.asObservable();
    }

    public selected(row: any) {
        console.info('content', row);
        this.router.navigate([
            'admin',
            row.table,
            row.partitionKey,
            row.rowKey
        ]);
    }
}
