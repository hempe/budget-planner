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
import { Files, IAsset, IFile, IGroup, IUnit } from '../../common/file';
import { MatPaginator, MatTabChangeEvent } from '@angular/material';
import {
    array,
    clone,
    numberWithSeperator,
    toNumber
} from '../../common/helper';

import { ConfigurationService } from '../../services/configuration';
import { DataSource } from '@angular/cdk/table';
import { FileService } from '../../services/file-service';
import { Http } from '@angular/http';
import { KeyboardService } from '../../services/keyboard';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';
import { MouseService } from '../../services/mouse';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { TEST_JSON } from '../../common/testing/test';

@Component({
    selector: 'edit',
    templateUrl: 'edit.component.html',
    styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {
    @ViewChild('tabGroup') tabGroup;

    public head: MenuEntry = {};
    public get units(): IUnit<IAsset>[] {
        return this.current[this.subType];
    }

    public set units(value: IUnit<IAsset>[]) {
        this.current[this.subType] = value;
    }

    public get unit(): IUnit<IAsset> {
        return this.units[this.unitId];
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

    private id: number;
    private current: any;

    public type: string;
    public subType: string;
    public columns: DataSourceColumn[];
    public dataSources: DataSourceFactory<IUnit<IAsset>[], IAsset>[];

    public label: string;
    public color: string;

    private updateEvents: EventEmitter<{}>[] = [];
    private keyDown: Subscription;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fileService: FileService,
        private config: ConfigurationService,
        private keyboardService: KeyboardService
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
        this.type = this.route.snapshot.params['type'];
        this.subType = this.route.snapshot.params['subtype'];

        this.current =
            id === undefined
                ? this.fileService.current[this.type]
                : this.fileService.current[this.type][toNumber(id)];

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
                type: 'number'
            });

        let path = `${this.type}.${this.subType}`;
        this.config.setColor(path);
        this.head = {
            icon: this.config.getIcon(path),
            name: this.config.getName(path),
            action: () => this.router.navigate(['/'])
        };
    }

    ngDoCheck() {}

    public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        this.unitId = this.tabGroup.selectedIndex;
    }

    ngOnDestroy(): void {
        this.keyDown.unsubscribe();
    }

    ngOnInit(): void {
        let startTab = this.route.snapshot.params['tab'];

        this.dataSources = this.units.map((unit, index) =>
            this.buidDataSource(unit, index)
        );

        if (startTab) {
            let index = this.units.findIndex(u => u.name == startTab);
            if (index >= 0) this.unitId = index;
        }

        if (!this.unitId) this.unitId = 0;
    }

    private buidDataSource(
        unit: IUnit<IAsset>,
        index: number
    ): DataSourceFactory<IUnit<IAsset>[], IAsset> {
        this.updateEvents[index] = new EventEmitter();
        return ref =>
            new ListDataSource(this.updateEvents[index], unit.elements, ref);
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

        this.onUpdate();
    }

    public up() {
        console.info('up');
        this.unit.elements.forEach((x, i) => {
            if (!x.checked) return;
            if (i <= 0 || this.unit.elements[i - 1].checked) return;
            let el = this.unit.elements.splice(i, 1)[0];
            this.unit.elements.splice(i - 1, 0, el);
        });

        this.onUpdate();
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

        this.onUpdate();
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

        this.onUpdate();
    }

    public delete() {
        console.info('delete');
        for (let i = 0; i < this.unit.elements.length; i++) {
            let x = this.unit.elements[i];
            if (!x.checked) continue;
            this.unit.elements.splice(i, 1);
            i--;
        }
        this.onUpdate();
    }

    public add() {
        console.info('add');
        this.unit.elements.push(<any>{});
        this.onUpdate();
    }

    private onUpdate() {
        if (this.updateEvents[this.unitId])
            this.updateEvents[this.unitId].emit();
        this.update.emit({});
    }
}
