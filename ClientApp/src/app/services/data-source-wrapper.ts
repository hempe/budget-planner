import { DataSource } from '@angular/cdk/table';
import { ElementRef, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { BehaviorSubject, Observable, fromEvent, merge } from 'rxjs';
import { getCompare } from '../common/helper';
import {
    debounceTime,
    distinctUntilChanged,
    flatMap,
    map
} from 'rxjs/operators';

export interface ExtendedDataSource<TValue> extends DataSource<TValue> {
    changed: Observable<TValue[]>;
}

export interface DataSourceColumn {
    name: string;
    key: string;
    type?: string;
    map?: any;
}
export interface DataSourceRefs {
    paginator: MatPaginator;
    filter: ElementRef;
    sort: MatSort;
    columns: DataSourceColumn[];
    getCompare(
        property: string,
        direction: '' | 'asc' | 'desc'
    ): (v1: any, v2: any) => number;
}
export type DataSourceFactory<TApi, TValue> = (
    refs: DataSourceRefs
) => ExtendedDataSource<TValue>;

export interface DataSourceValue<TValue> {
    results: TValue[];
    count: number;
}

export class ListDataSource<TValue> extends DataSource<TValue>
    implements ExtendedDataSource<TValue> {
    private properties: string[];
    changed: EventEmitter<TValue[]> = new EventEmitter();

    constructor(
        private list: Observable<TValue[]>,
        private refs: DataSourceRefs
    ) {
        super();
        if (refs.filter) {
            fromEvent(refs.filter.nativeElement, 'keyup')
                .pipe(
                    debounceTime(150),
                    distinctUntilChanged()
                )
                .subscribe(() => {
                    console.info('apply filter');
                    this.filter = refs.filter.nativeElement.value;
                });
        }
        this.properties = this.refs.columns
            .filter(x => x.type === 'text' || x.type === 'number')
            .map(x => x.key);
    }
    filterChange = new BehaviorSubject('');
    get filter(): string {
        return this.filterChange.value;
    }
    set filter(filter: string) {
        this.filterChange.next(filter);
    }

    connect(): Observable<TValue[]> {
        const displayDataChanges = [
            this.refs.paginator.page.asObservable(),
            this.filterChange.asObservable(),
            this.refs.sort.sortChange.asObservable(),
            this.list
        ];

        let list: TValue[] = [];
        this.list.subscribe(x => (list = x));

        merge(...displayDataChanges).subscribe(() => {
            if (!list) {
                return;
            }
            this.refs.paginator.length = list.length;
            let result = list.map(x => x);
            if (this.filter) {
                const expr = new RegExp(this.filter, 'i');
                result = list.filter(
                    t =>
                        this.properties.findIndex(
                            p => t[p] && t[p].toString().match(expr)
                        ) >= 0
                );
            }
            if (this.refs.sort.active && this.refs.sort.direction) {
                // *?*
                let comparer = this.refs.getCompare(
                    this.refs.sort.active,
                    this.refs.sort.direction
                );
                if (!comparer) {
                    comparer = getCompare(
                        this.refs.sort.active,
                        this.refs.sort.direction
                    );
                }
                result = result.sort(comparer);
            }
            const paged = result.slice(
                this.refs.paginator.pageIndex * this.refs.paginator.pageSize,
                (this.refs.paginator.pageIndex + 1) *
                    this.refs.paginator.pageSize
            );
            this.changed.emit(paged);
        });

        return this.changed.asObservable();
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
            fromEvent(filterElement.nativeElement, 'keyup')
                .pipe(
                    debounceTime(150),
                    distinctUntilChanged()
                )
                .subscribe(() => {
                    console.info('apply filter');
                    this.filter = filterElement.nativeElement.value;
                });
        }
    }

    filterChange = new BehaviorSubject('');
    get filter(): string {
        return this.filterChange.value;
    }
    set filter(filter: string) {
        this.filterChange.next(filter);
    }

    connect(): Observable<TValue[]> {
        const displayDataChanges = [this.paginator.page, this.filterChange];

        return merge(...displayDataChanges).pipe(
            flatMap(() => {
                return this.call(
                    this.api,
                    this.paginator.pageIndex + 1,
                    this.filter
                ).pipe(
                    map((x: any) => {
                        this.paginator.length = x.count;
                        return x.results;
                    })
                );
            })
        );
    }

    disconnect() {}
}
