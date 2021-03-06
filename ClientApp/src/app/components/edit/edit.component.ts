import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { MatTabChangeEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { NamedValue, Unit } from '../../common/api';
import { array, clone, isNullOrWhitespace } from '../../common/helper';
import { ConfigurationService } from '../../services/configuration';
import { DataSourceColumn, DataSourceFactory, ListDataSource } from '../../services/data-source-wrapper';
import { KeyboardService } from '../../services/keyboard';
import { DashboardConfig } from '../dashboard/dashboard';
import { ThemeSelector } from '../theme-selector/theme-selector.component';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';

@Component({
    selector: 'edit',
    templateUrl: 'edit.component.html',
    styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {
    @ViewChild('tabGroup') tabGroup;

    public head: MenuEntry = {};
    public units: Unit<NamedValue>[];

    public get unit(): Unit<NamedValue> {
        return this.units && this.unitId !== undefined
            ? this.units[this.unitId]
            : undefined;
    }

    private _unitId: number;
    private get unitId(): number {
        return this._unitId;
    }

    private set unitId(value: number) {
        this.tabGroup.selectedIndex = value;
        this._unitId = value;
        this.onUpdate();
    }

    public update: EventEmitter<{}> = new EventEmitter<{}>();
    public columns: DataSourceColumn[];
    public dataSources: DataSourceFactory<Unit<NamedValue>[], NamedValue>[];
    public label: string;
    public color: string;
    public touched = false;
    public type: string;
    public subType: string;
    public theme: string;

    private updateEvents: EventEmitter<NamedValue[]>[] = [];
    private keyDown: Subscription;

    private url: string;
    private dashboardUrl: string;
    private id: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private http: Http,
        private config: ConfigurationService,
        private keyboardService: KeyboardService,
        private themeSelector: ThemeSelector
    ) {
        this.keyDown = this.keyboardService.keyDown.subscribe(e => {
            if (this.keyboardService.isInputActive()) {
                return;
            }

            if (e.key === 'ArrowDown') {
                this.down();
            }
            if (e.key === 'ArrowUp') {
                this.up();
            }
            if (e.key === 'ArrowRight') {
                if (this.unitId < this.units.length - 1) {
                    this.unitId++;
                }
            }
            if (e.key === 'ArrowLeft') {
                if (this.unitId > 0) {
                    this.unitId--;
                }
            }
            if (e.key === 'Delete') {
                this.delete();
            }
            if (e.key === 'Insert') {
                this.add();
            }
        });

        const id = this.route.snapshot.params['id'];
        if (!isNullOrWhitespace(id)) {
            this.id = id;
        }

        this.type = this.route.snapshot.data.type;
        this.subType = this.route.snapshot.data.subType;

        this.url =
            id === undefined
                ? `/api/${this.type}/${this.subType}`
                : `/api/${this.type}/${id}/${this.subType}`;

        this.dashboardUrl =
            id === undefined
                ? `/api/dashboard/${this.type}.${this.subType}`
                : `/api/dashboard/${this.type}.${this.subType}/${id}`;
    }

    private init() {
        this.units = array(this.units);
        this.units.forEach(u => (u.elements = array(u.elements)));

        this.label = this.config.getTranslatedName(
            `${this.type}.${this.subType}`
        );
        this.color = this.config.getColor(`${this.type}.${this.subType}`);

        if (this.type === 'assets') {
            this.columns = [
                { key: 'name', name: 'name', type: 'text' },
                { key: 'value', name: 'amount', type: 'decimal' }
            ];
        }

        if (this.type === 'revenue') {
            this.columns = [
                { key: 'name', name: 'name', type: 'text' },
                { key: 'year', name: 'Year', type: 'number' },
                { key: 'value', name: 'amount', type: 'decimal' }
            ];
        }

        if (this.type === 'budgets') {
            this.columns = [
                { key: 'name', name: 'name', type: 'text' },
                {
                    key: 'frequency',
                    name: 'frequency.frequency',
                    type: 'frequency'
                },
                { key: 'value', name: 'amount', type: 'decimal' }
            ];
        }

        const path = `${this.type}.${this.subType}`;
        this.config.setColor(path);
        this.head = {
            icon: 'arrow_back',
            name: this.config.getName(path),
            action: () =>
                this.router.navigate(['../'], { relativeTo: this.route })
        };

        const startTab = this.route.snapshot.params['tab'];

        setTimeout(() => {
            this.dataSources = this.units.map((unit, index) =>
                this.buidDataSource(unit, index)
            );

            if (startTab) {
                const index = this.units.findIndex(u => u.name === startTab);
                if (index >= 0) {
                    this.unitId = index;
                }
            }

            if (!this.unitId) {
                this.unitId = 0;
            }
            this.onUpdate(false);
        });
    }

    public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        this.unitId = this.tabGroup.selectedIndex;
    }

    ngOnDestroy(): void {
        this.keyDown.unsubscribe();
    }

    ngOnInit(): void {
        this.http
            .get(this.url)
            .pipe(map(x => x.json()))
            .subscribe(x => {
                this.units = x;
                this.init();
            });

        this.http
            .get(this.dashboardUrl)
            .pipe(map(x => x.json()))
            .subscribe(x => (this.theme = x.theme));
    }

    private buidDataSource(
        unit: Unit<NamedValue>,
        index: number
    ): DataSourceFactory<Unit<NamedValue>[], NamedValue> {
        this.updateEvents[index] = new EventEmitter();
        return ref => new ListDataSource(this.updateEvents[index], ref);
    }

    public selected(row: any) {}
    public addFolder() {
        this.units.push({ elements: [], name: 'New' });
        this.onFoldersModified();
    }

    public deleteFolder() {
        this.units.splice(this.unitId, 1);
        this.unitId--;
        this.onFoldersModified();
    }

    public onFoldersModified() {
        if (!this.units.length) {
            this.addFolder();
            return;
        }

        this.dataSources = this.units.map((unit, index) =>
            this.buidDataSource(unit, index)
        );
        if (this.unitId > this.units.length) {
            this.unitId = this.units.length - 1;
        }
        if (this.unitId < 0) {
            this.unitId = 0;
        }

        this.unitId = this.unitId;
        this.onUpdate(true);
        setTimeout(() => this.onUpdate(true), 0);
    }

    public up() {
        console.info('up');
        this.unit.elements.forEach((x, i) => {
            if (!x.checked) {
                return;
            }
            if (i <= 0 || this.unit.elements[i - 1].checked) {
                return;
            }
            const el = this.unit.elements.splice(i, 1)[0];
            this.unit.elements.splice(i - 1, 0, el);
        });

        this.onUpdate(true);
    }

    public down() {
        console.info('down');
        this.unit.elements.reverse().forEach((x, i) => {
            if (!x.checked) {
                return;
            }
            if (i <= 0 || this.unit.elements[i - 1].checked) {
                return;
            }
            const el = this.unit.elements.splice(i, 1)[0];
            this.unit.elements.splice(i - 1, 0, el);
        });
        this.unit.elements.reverse();

        this.onUpdate(true);
    }

    public copy() {
        console.info('copy');
        this.unit.elements.forEach((x, i) => {
            if (!x.checked) {
                return;
            }
            x.checked = false;
            const y = clone(x);
            y.name = y.name + '(Copy)';
            this.unit.elements.splice(i + 1, 0, y);
        });

        this.onUpdate(true);
    }

    public delete() {
        console.info('delete');
        for (let i = 0; i < this.unit.elements.length; i++) {
            const x = this.unit.elements[i];
            if (!x.checked) {
                continue;
            }
            this.unit.elements.splice(i, 1);
            i--;
        }
        this.onUpdate(true);
    }

    public add() {
        console.info('add');
        this.unit.elements.push(<any>{});
        this.onUpdate(true);
    }

    public save() {
        console.info('save');
        this.http
            .post(this.url, this.units)
            .pipe(map(x => x.json()))
            .subscribe(
                x => {
                    this.units = x;
                    this.units = this.units;
                    this.unitId = this.unitId;
                    this.onUpdate(false);
                },
                err => {
                    console.error(err);
                    alert(err);
                }
            );
    }

    public onEdit(name: string) {
        const index = this.units.findIndex(x => x.name === name);
        if (index >= 0) {
            this.unitId = index;
        }
    }

    public pin() {
        if (this.theme) {
            this.http
                .delete(this.dashboardUrl)
                .subscribe(x => (this.theme = undefined));
        } else {
            this.themeSelector.selectTheme().subscribe(theme => {
                this.http
                    .post('/api/dashboard', <DashboardConfig>{
                        path: `${this.type}.${this.subType}`,
                        theme: theme,
                        id: this.id,
                        type: 'doughnut'
                    })
                    .pipe(map(x => x.json()))
                    .subscribe(x => (this.theme = x.theme));
            });
        }
    }

    private onUpdate(touched?: boolean) {
        if (touched !== undefined) {
            this.touched = touched;
        }

        for (let i = 0; i < this.units.length; i++) {
            this.updateEvents[i].emit(this.units[i].elements);
        }
        this.update.emit({});
    }
}
