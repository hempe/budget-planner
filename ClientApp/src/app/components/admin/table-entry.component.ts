import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Http } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { clone } from '../../common/helper';
import { ConfigurationService } from '../../services/configuration';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';
import { map } from 'rxjs/operators';

interface Table {
    partitionKey: string;
    rowKey: string;
    table: string;
    data: Map<string, any>;
}
@Component({
    selector: 'table-entry',
    templateUrl: 'table-entry.component.html',
    styleUrls: ['table-entry.component.css']
})
export class TableEntryComponent implements OnInit, OnDestroy {
    public head: MenuEntry = {};
    public meta: any[];
    public value: any;
    private table: string;
    private url = ``;

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
                this.router.navigate(['../../'], { relativeTo: this.route })
        };

        this.config.setColor('admin');
    }

    ngOnInit() {
        this.table = this.route.snapshot.params['table'];
        const partitionKey = this.route.snapshot.params['partitionKey'];
        const rowKey = this.route.snapshot.params['rowKey'];
        this.head.name = this.table;

        const headerUrl = `/api/admin/tables/headers/detailed/${this.table}`;
        this.http
            .get(headerUrl)
            .pipe(map(x => x.json()))
            .subscribe((x: Map<string, any>[]) => {
                this.meta = Object.keys(x).map(
                    c =>
                        <any>{
                            key: c,
                            value: x[c]
                        }
                );

                this.url = `/api/admin/tables/${
                    this.table
                }/${partitionKey}/${rowKey}`;
                console.info('and the url is ', this.url);
                this.http
                    .get(this.url)
                    .pipe(map(y => y.json()))
                    .subscribe(y => this.setValue(y, null));
            });
    }

    public onSubmit(form: NgForm): void {
        this.http
            .post(this.url, this.value)
            .pipe(map(x => x.json()))
            .subscribe(
                x => this.setValue(x, form),
                err => this.resetForm(form)
            );
    }

    public delete(): void {
        this.http
            .delete(this.url)
            .pipe(map(x => x.json()))
            .subscribe(x => {
                this.router.navigate(['../../'], { relativeTo: this.route });
            });
    }

    private setValue(x: any, form: NgForm) {
        this.value = clone(x);
        this.resetForm(form);
    }

    private resetForm(form: NgForm) {
        if (form) {
            form.control.markAsUntouched();
            form.control.markAsPristine();
        }
    }

    ngOnDestroy(): void {}
}
