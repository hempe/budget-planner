import { ActivatedRoute, Router } from '@angular/router';
import {
    AfterViewInit,
    Component,
    EventEmitter,
    HostListener,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { Color, Colors } from 'ng2-charts';
import {
    DataSourceColumn,
    DataSourceFactory,
    DataSourceValue,
    ListDataSource
} from '../../services/data-source-wrapper';
import { Files, Group, IFile, NamedValue, Unit } from '../../common/file';
import { MatPaginator, MatTabChangeEvent } from '@angular/material';
import {
    array,
    clone,
    isNumber,
    numberWithSeperator,
    toNumber
} from '../../common/helper';

import { ConfigurationService } from '../../services/configuration';
import { DashboardConfig } from '../dashboard/dashboard';
import { DataSource } from '@angular/cdk/table';
import { FileService } from '../../services/file-service';
import { Http } from '@angular/http';
import { KeyboardService } from '../../services/keyboard';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';
import { MouseService } from '../../services/mouse';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { ThemeSelector } from '../theme-selector/theme-selector.component';

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
    public touched: boolean = false;
    public type: string;
    public subType: string;

    private updateEvents: EventEmitter<NamedValue[]>[] = [];
    private keyDown: Subscription;
    private theme: string;
    private url: string;
    private dashboardUrl: string;
    private id?: number;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private http: Http,
        private fileService: FileService,
        private config: ConfigurationService,
        private keyboardService: KeyboardService,
        private themeSelector: ThemeSelector
    ) {
        this.keyDown = this.keyboardService.keyDown.subscribe(e => {
            if (
                document.activeElement &&
                (document.activeElement.nodeName == 'INPUT' ||
                    document.activeElement.nodeName == 'TEXTAREA') &&
                !document.activeElement.classList.contains('mat-checkbox-input')
            )
                return;

            if (e.key == 'ArrowDown') this.down();
            if (e.key == 'ArrowUp') this.up();
            if (e.key == 'ArrowRight') {
                if (this.unitId < this.units.length - 1) {
                    this.unitId++;
                }
            }
            if (e.key == 'ArrowLeft') {
                if (this.unitId > 0) {
                    this.unitId--;
                }
            }
            if (e.key == 'Delete') this.delete();
            if (e.key == 'Insert') this.add();
        });

        let id = this.route.snapshot.params['id'];
        if (isNumber(id)) this.id = Number(id);

        this.type = this.route.snapshot.data.type;
        this.subType = this.route.snapshot.data.subType;

        this.url =
            id === undefined
                ? `/api/data/${this.type}/${this.subType}`
                : `/api/data/${this.type}/${id}/${this.subType}`;

        this.dashboardUrl =
            id === undefined
                ? `/api/data/dashboard/${this.type}.${this.subType}`
                : `/api/data/dashboard/${this.type}.${this.subType}/${id}`;
    }

    private init() {
        this.units = array(this.units);
        this.units.forEach(u => (u.elements = array(u.elements)));

        this.label = this.config.getName(`${this.type}.${this.subType}`);
        this.color = this.config.getColor(`${this.type}.${this.subType}`);

        this.columns = [
            { key: 'name', name: 'Name', type: 'text' },
            { key: 'value', name: 'Amount', type: 'number' }
        ];
        if (this.type == 'revenue')
            this.columns.push({ key: 'year', name: 'Year', type: 'number' });

        if (this.type == 'budgets')
            this.columns.push({
                key: 'frequency',
                name: 'Frequency',
                type: 'frequency'
            });

        let path = `${this.type}.${this.subType}`;
        this.config.setColor(path);
        this.head = {
            icon: 'arrow_back',
            name: this.config.getName(path),
            action: () =>
                this.router.navigate(['../'], { relativeTo: this.route })
        };

        let startTab = this.route.snapshot.params['tab'];

        setTimeout(() => {
            this.dataSources = this.units.map((unit, index) =>
                this.buidDataSource(unit, index)
            );

            if (startTab) {
                let index = this.units.findIndex(u => u.name == startTab);
                if (index >= 0) this.unitId = index;
            }

            if (!this.unitId) this.unitId = 0;
            this.onUpdate(false);
        });
    }

    ngDoCheck() {}

    public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        this.unitId = this.tabGroup.selectedIndex;
    }

    ngOnDestroy(): void {
        this.keyDown.unsubscribe();
    }

    ngOnInit(): void {
        this.http
            .get(this.url)
            .map(x => x.json())
            .subscribe(x => {
                this.units = x;
                this.init();
            });

        this.http
            .get(this.dashboardUrl)
            .map(x => x.json())
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
        if (this.unitId > this.units.length)
            this.unitId = this.units.length - 1;
        if (this.unitId < 0) this.unitId = 0;

        this.unitId = this.unitId;
        this.onUpdate(true);
        setTimeout(() => this.onUpdate(true), 0);
    }

    public up() {
        console.info('up');
        this.unit.elements.forEach((x, i) => {
            if (!x.checked) return;
            if (i <= 0 || this.unit.elements[i - 1].checked) return;
            let el = this.unit.elements.splice(i, 1)[0];
            this.unit.elements.splice(i - 1, 0, el);
        });

        this.onUpdate(true);
    }

    public down() {
        console.info('down');
        this.unit.elements.reverse().forEach((x, i) => {
            if (!x.checked) return;
            if (i <= 0 || this.unit.elements[i - 1].checked) return;
            let el = this.unit.elements.splice(i, 1)[0];
            this.unit.elements.splice(i - 1, 0, el);
        });
        this.unit.elements.reverse();

        this.onUpdate(true);
    }

    public copy() {
        console.info('copy');
        this.unit.elements.forEach((x, i) => {
            if (!x.checked) return;
            x.checked = false;
            let y = clone(x);
            y.name = y.name + '(Copy)';
            this.unit.elements.splice(i + 1, 0, y);
        });

        this.onUpdate(true);
    }

    public delete() {
        console.info('delete');
        for (let i = 0; i < this.unit.elements.length; i++) {
            let x = this.unit.elements[i];
            if (!x.checked) continue;
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
            .map(x => x.json())
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
        let index = this.units.findIndex(x => x.name == name);
        if (index >= 0) this.unitId = index;
    }

    public pin() {
        if (this.theme)
            this.http
                .delete(this.dashboardUrl)
                .subscribe(x => (this.theme = undefined));
        else
            this.themeSelector.selectTheme().subscribe(theme => {
                this.http
                    .post('/api/data/dashboard', <DashboardConfig>{
                        path: `${this.type}.${this.subType}`,
                        theme: theme,
                        id: this.id,
                        type: 'doughnut'
                    })
                    .map(x => x.json())
                    .subscribe(x => (this.theme = x.theme));
            });
    }

    private onUpdate(touched?: boolean) {
        if (touched !== undefined) this.touched = touched;

        for (let i = 0; i < this.units.length; i++) {
            this.updateEvents[i].emit(this.units[i].elements);
        }
        this.update.emit({});
    }
}
