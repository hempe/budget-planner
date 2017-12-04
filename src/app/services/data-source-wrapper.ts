import { BehaviorSubject, Observable } from 'rxjs';

import { DataSource } from '@angular/cdk/table';
import { ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MenuEntry } from '../components/view-wrapper/view-wrapper.component';
import { count } from 'rxjs/operators/count';

export interface DataSourceColumn {
    name: string;
    key: string;
}

export interface DataSourceDefinition<TApi, TValue> {
    name: string;
    columns: DataSourceColumn[];
    createDataSource: (
        paginator: MatPaginator,
        filterElement: ElementRef,
        columns: DataSourceColumn[]
    ) => DataSource<TValue>;
}

export interface DataSourceValue<TValue> {
    results: TValue[];
    count: number;
}

export class ListDataSource<TValue> extends DataSource<TValue> {
    private properties: string[];

    constructor(
        private list: TValue[],
        private paginator: MatPaginator,
        private filterElement: ElementRef,
        columns: DataSourceColumn[]
    ) {
        super();
        if (filterElement) {
            Observable.fromEvent(filterElement.nativeElement, 'keyup')
                .debounceTime(150)
                .distinctUntilChanged()
                .subscribe(() => {
                    console.info('apply filter');
                    this.filter = filterElement.nativeElement.value;
                });
        }

        this.properties = columns.map(x => x.key);
    }
    URLSearchParams;
    filterChange = new BehaviorSubject('');
    get filter(): string {
        return this.filterChange.value;
    }
    set filter(filter: string) {
        this.filterChange.next(filter);
    }

    connect(): Observable<TValue[]> {
        const displayDataChanges = [this.paginator.page, this.filterChange];

        return Observable.merge(...displayDataChanges).map(() => {
            this.paginator.length = this.list.length;

            let expr = new RegExp(this.filter, 'i');
            let result = this.list.filter(
                t =>
                    this.properties.findIndex(
                        p => t[p] && t[p].toString().match(expr)
                    ) >= 0
            );
            let paged = result.slice(
                this.paginator.pageIndex * this.paginator.pageSize,
                (this.paginator.pageIndex + 1) * this.paginator.pageSize
            );
            return paged;
        });
    }

    disconnect() {}
}

export class ApiDataSource<TApi, TValue> extends DataSource<TValue> {
    constructor(
        private api: TApi,
        private paginator: MatPaginator,
        private call: (
            arg: TApi,
            page?: number,
            query?: any
        ) => Observable<DataSourceValue<TValue>>,
        private filterElement?: ElementRef
    ) {
        super();
        if (filterElement) {
            Observable.fromEvent(filterElement.nativeElement, 'keyup')
                .debounceTime(150)
                .distinctUntilChanged()
                .subscribe(() => {
                    console.info('apply filter');
                    this.filter = filterElement.nativeElement.value;
                });
        }
    }
    URLSearchParams;
    filterChange = new BehaviorSubject('');
    get filter(): string {
        return this.filterChange.value;
    }
    set filter(filter: string) {
        this.filterChange.next(filter);
    }

    connect(): Observable<TValue[]> {
        const displayDataChanges = [this.paginator.page, this.filterChange];

        return Observable.merge(...displayDataChanges).flatMap(() => {
            return this.call(
                this.api,
                this.paginator.pageIndex + 1,
                this.filter
            ).map((x: any) => {
                this.paginator.length = x.count;
                return x.results;
            });
        });
    }

    disconnect() {}
}
