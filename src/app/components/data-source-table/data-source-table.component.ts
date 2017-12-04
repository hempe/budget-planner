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
    DataSourceDefinition
} from '../../services/data-source-wrapper';

import { DataSource } from '@angular/cdk/table';
import { MatPaginator } from '@angular/material';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';

@Component({
    selector: 'data-source-table',
    templateUrl: 'data-source-table.component.html',
    styleUrls: ['data-source-table.component.css']
})
export class DataSourceTableComponent implements OnInit {
    constructor() {}

    @ViewChild('filter') filter: ElementRef;

    @Input() public dataSource: DataSourceDefinition<any, any> | null;

    public ngOnInit(): void {
        this.columns = this.dataSource.columns.map(x => x.key);
        this.headers = this.dataSource.columns;
        this.data = this.dataSource.createDataSource(
            this.paginator,
            this.filter,
            this.dataSource.columns
        );
    }

    public data: DataSource<any>;
    public columns: string[];
    public headers: DataSourceColumn[];

    @ViewChild(MatPaginator) public paginator: MatPaginator;

    @Output() public selected: EventEmitter<any> = new EventEmitter<any>();

    public onSelected(row: any): void {
        //this.selected.emit(row);
    }
}
