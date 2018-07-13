import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { MatPaginator, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';
import { FREQUENCIES } from '../../common/frequencies';
import { getCompare, getTransformCompare, toNumber, unique } from '../../common/helper';
import { DataSourceColumn, DataSourceFactory, ExtendedDataSource } from '../../services/data-source-wrapper';

@Component({
    selector: 'data-source-table',
    templateUrl: 'data-source-table.component.html',
    styleUrls: ['data-source-table.component.css']
})
export class DataSourceTableComponent implements OnInit, OnDestroy {
    constructor() {}

    public frequencies = FREQUENCIES;
    public dataSource: ExtendedDataSource<any>;
    public headers: DataSourceColumn[];
    public cols: string[];
    public checked: boolean;
    public indeterminate: boolean;

    @ViewChild('filter') filter: ElementRef;

    @Input() public dataSourceFactory: DataSourceFactory<any, any> | null;
    @Input() public columns: DataSourceColumn[];
    @Input()
    public get selectable(): boolean {
        return this._selectable;
    }
    public set selectable(value: boolean) {
        this._selectable = value === true || <any>value === 'true';
    }

    @Input()
    public get editable(): boolean {
        return this._editable;
    }
    public set editable(value: boolean) {
        this._editable = value === true || <any>value === 'true';
    }

    @Output() public changed: EventEmitter<any> = new EventEmitter<any>();
    @Output() public selected: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(MatPaginator) public paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    private _selectable: boolean;
    private _editable: boolean;

    private subscription: Subscription;
    private values: any[];

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public ngOnInit(): void {
        this.headers = unique(this.columns);
        this.cols = unique(
            this.selectable
                ? [''].concat(this.columns.map(x => x.key)).filter(x => x)
                : this.columns.map(x => x.key).filter(x => x)
        );

        this.dataSource = this.dataSourceFactory({
            paginator: this.paginator,
            filter: this.filter,
            sort: this.sort,
            columns: this.columns,
            getCompare: (property: string, direction: '' | 'asc' | 'desc') => {
                const col = this.columns.find(x => x.key === property);
                if (col.type === 'decimal' || col.type === 'number') {
                    return getTransformCompare(property, direction, x =>
                        toNumber(x)
                    );
                }

                return getCompare(property, direction);
            }
        });
        this.subscription = this.dataSource.changed.subscribe(x =>
            this.checkIndeterminate(x)
        );
    }

    public check(value: any) {
        this.values.forEach(x => (x.checked = this.checked));
    }

    public setIndeterminate() {
        this.checkIndeterminate(this.values);
    }

    public onSelected(row: any): void {
        this.selected.emit(row);
    }

    public onChange(row: any) {
        this.changed.emit(row);
    }

    private checkIndeterminate(values: any[]): void {
        this.values = values;
        if (!values) {
            return;
        }

        this.indeterminate = false;
        let first;

        for (const x of values) {
            if (first === undefined) {
                first = x;
            }
            if (!x.checked !== !first.checked) {
                this.indeterminate = true;
                break;
            }
        }
        if (this.indeterminate) {
            this.checked = true;
        } else if (first && !first.checked !== !this.checked) {
            this.checked = !!first.checked;
        }
    }

    public onBlur(evn, foc) {
        console.error('focus', evn, foc);
    }
    public onFocus(evn, foc) {
        console.error('blur', evn, foc);
    }
}
