import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {
    DataSourceColumn,
    DataSourceFactory
} from '../../services/data-source-wrapper';
import { MatPaginator, MatSort } from '@angular/material';

import { DataSource } from '@angular/cdk/table';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';
import { unique } from '../../common/helper';

@Component({
    selector: 'data-source-table',
    templateUrl: 'data-source-table.component.html',
    styleUrls: ['data-source-table.component.css']
})
export class DataSourceTableComponent implements OnInit {
    constructor() {}

    @ViewChild('filter') filter: ElementRef;

    @Input() public dataSourceFactory: DataSourceFactory<any, any> | null;
    @Input() public columns: DataSourceColumn[];
    @Input() public selectable: boolean;

    @Output() public changed: EventEmitter<any> = new EventEmitter<any>();
    @Output() public selected: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(MatPaginator) public paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    public ngOnInit(): void {
        this.headers = unique(this.columns);
        this.cols = unique(
            this.selectable
                ? [''].concat(this.columns.map(x => x.key))
                : this.columns.map(x => x.key)
        );

        this.dataSource = this.dataSourceFactory({
            paginator: this.paginator,
            filter: this.filter,
            sort: this.sort,
            columns: this.columns
        });
    }

    public dataSource: DataSource<any>;
    public headers: DataSourceColumn[];

    public cols: string[];

    private cj = true;
    public isChecked(row: any) {
        return this.cj;
    }
    public toggleChecked(row: any) {
        this.cj = !this.cj;
        console.info('toggle');
    }

    public onSelected(row: any): void {
        this.selected.emit(row);
    }

    public onChange(row: any) {
        this.changed.emit(row);
    }
}
