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
import { array, clone, numberWithSeperator } from '../../common/helper';

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
    public units: IUnit<IAsset>[];
    public update: EventEmitter<{}> = new EventEmitter<{}>();

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
            if (e.key == 'Delete') this.delete();
            if (e.key == 'Insert') this.add();
        });

        this.type = this.route.snapshot.params['type'];
        this.subType = this.route.snapshot.params['subtype'];
        this.fileService.current.assets.negativ;
        this.units = array(this.fileService.current[this.type][this.subType]);
        this.units.forEach(u => (u.elements = array(u.elements)));

        this.label = this.config.getName(`${this.type}.${this.subType}`);
        this.color = this.config.getColor(`${this.type}.${this.subType}`);

        this.columns = [
            { key: 'name', name: 'Name', type: 'text' },
            { key: 'value', name: 'Amount', type: 'number' }
        ];
        if (this.type == 'revenue')
            this.columns.push({ key: 'year', name: 'Year', type: 'number' });

        let path = `${this.type}.${this.subType}`;
        this.config.setColor(path);
        this.head = {
            icon: this.config.getIcon(path),
            name: this.config.getName(path),
            action: () => this.router.navigate(['/'])
        };
    }

    public tabChanged(tabChangeEvent: MatTabChangeEvent): void {}

    ngOnDestroy(): void {
        this.keyDown.unsubscribe();
    }

    ngOnInit(): void {
        this.dataSources = this.units.map((unit, index) =>
            this.buidDataSource(unit, index)
        );
    }

    private buidDataSource(
        unit: IUnit<IAsset>,
        index: number
    ): DataSourceFactory<IUnit<IAsset>[], IAsset> {
        this.updateEvents[index] = new EventEmitter();
        return ref =>
            new ListDataSource(this.updateEvents[index], unit.elements, ref);
    }

    public changed(row: any) {
        this.update.emit();
    }

    public selected(row: any) {}
    public up() {
        console.info('up');
        let group = this.tabGroup.selectedIndex;
        let unit = this.units[group];

        unit.elements.forEach((x, i) => {
            if (!x.checked) return;
            if (i <= 0 || unit.elements[i - 1].checked) return;
            let el = unit.elements.splice(i, 1)[0];
            unit.elements.splice(i - 1, 0, el);
        });

        this.updateEvents[group].emit();
        this.update.emit({});
    }

    public down() {
        console.info('down');
        let group = this.tabGroup.selectedIndex;
        let unit = this.units[group];

        unit.elements.reverse().forEach((x, i) => {
            if (!x.checked) return;
            if (i <= 0 || unit.elements[i - 1].checked) return;
            let el = unit.elements.splice(i, 1)[0];
            unit.elements.splice(i - 1, 0, el);
        });
        unit.elements.reverse();

        this.updateEvents[group].emit();
        this.update.emit({});
    }

    public copy() {
        console.info('copy');
        let group = this.tabGroup.selectedIndex;
        let unit = this.units[group];

        unit.elements.forEach((x, i) => {
            if (!x.checked) return;
            x.checked = false;
            let y = clone(x);
            y.name = y.name + '(Copy)';
            unit.elements.splice(i + 1, 0, y);
        });

        this.updateEvents[group].emit();
        this.update.emit({});
    }

    public delete() {
        console.info('delete');
        let group = this.tabGroup.selectedIndex;
        let unit = this.units[group];

        unit.elements.forEach((x, i) => {
            if (!x.checked) return;
            unit.elements.splice(i, 1);
        });

        this.updateEvents[group].emit();
        this.update.emit({});
    }

    public add() {
        console.info('add');
        let group = this.tabGroup.selectedIndex;
        let unit = this.units[group];
        unit.elements.push(<any>{});
        this.updateEvents[group].emit();
        this.update.emit({});
    }
}
