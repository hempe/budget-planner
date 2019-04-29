import { ChangeDetectionStrategy, Component, EventEmitter, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Http } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OverviewValue } from '../../common/api';
import { clone, guid } from '../../common/helper';
import { ConfigurationService } from '../../services/configuration';
import { DashboardConfig } from '../dashboard/dashboard';
import { ThemeSelector } from '../theme-selector/theme-selector.component';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';

@Component({
    selector: 'budget',
    templateUrl: 'budget.component.html',
    styleUrls: ['budget.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BudgetComponent implements OnInit {
    public head: MenuEntry = {};

    public type = 'budgets';
    public color: string;
    public value: EventEmitter<OverviewValue> = new EventEmitter<OverviewValue>();
    public pinned: EventEmitter<boolean> = new EventEmitter<boolean>();
    private _pinned: boolean;
    private _value: OverviewValue;
    private id: string;
    private url: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private config: ConfigurationService,
        private http: Http,
        private themeSelector: ThemeSelector
    ) {
        this.head = {
            icon: 'arrow_back',
            name: this.config.getName('budgets'),
            action: () =>
                this.router.navigate(['../'], { relativeTo: this.route })
        };

        this.config.setColor('budgets');
        this.color = this.config.getColor('budgets');
    }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.url = `/api/${this.type}/${this.id}`;
        this.getData();

        this.http
            .get(`/api/dashboard/${this.type}/${this.id}`)
            .pipe(map(x => x.json()))
            .subscribe(x => (this.setPinned(x.theme)));
    }

    public goto(path: string) {
        this.router.navigate(['budgets', this.id, path]);
    }

    private getData(): void {
        this.http.get(this.url).pipe(
            map(x => x.json()),
            map((x: OverviewValue) => {
                this._value = x;
                this.value.emit(this._value);
            })
        ).subscribe();
    }

    public delete(): void {
        this.http.delete(`/api/budgets/${this.id}`).subscribe(x => {
            this.router.navigate(['../'], { relativeTo: this.route });
        });
    }

    public copy(): void {
        this.http
            .post(`/api/budgets/${this.id}/copy/${guid()}`, null)
            .pipe(map(x => x.json()))
            .subscribe();
    }

    public pin() {
        if (this._pinned) {
            this.http
                .delete(`/api/dashboard/${this.type}/${this.id}`)
                .subscribe(x => this.setPinned(false));
        } else {
            this.themeSelector.selectTheme().subscribe(theme => {
                this.http
                    .post('/api/dashboard', <DashboardConfig>{
                        path: this.type,
                        id: this.id,
                        theme: theme,
                        type: 'bar'
                    })
                    .pipe(map(x => x.json()))
                    .subscribe(x => this.setPinned(x.theme));
            });
        }
    }

    public save(form: NgForm): void {
        this.http
            .post(`/api/budgets/${this.id}`, this._value)
            .pipe(map(x => x.json()))
            .subscribe(
                x => this.setValue(x, form),
                err => this.resetForm(form)
            );
    }

    private setPinned(pinned: boolean): Observable<boolean> {
        this._pinned = pinned;
        this.pinned.emit(pinned);
        return this.pinned.asObservable();
    }

    private setValue(x: any, form: NgForm) {
        this._value = clone(x);
        this.value.emit(this._value);
        this.resetForm(form);
    }

    private resetForm(form: NgForm) {
        if (form) {
            form.control.markAsUntouched();
            form.control.markAsPristine();
        }
    }
}
