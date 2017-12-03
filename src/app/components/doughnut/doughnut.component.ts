import { Color, Colors } from 'ng2-charts';
import {
    Component,
    EventEmitter,
    HostListener,
    Input,
    Output
} from '@angular/core';
import { Files, IAsset, IFile, IUnit } from '../../common/file';
import { array, numberWithSeperator } from '../../common/helper';

import { FileService } from '../../services/file-service';
import { Http } from '@angular/http';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';
import { MouseService } from '../../services/mouse';
import { TEST_JSON } from '../../common/testing/test';

@Component({
    selector: 'doughnut',
    templateUrl: 'doughnut.component.html',
    styleUrls: ['./doughnut.component.css']
})
export class DoughnutComponent {
    public datasets: Colors[] = [];
    public labels: string[];

    public options: any = {
        maintainAspectRatio: false,
        responsive: false,
        legend: {
            display: false
        },
        hover: {
            onHover: function(e) {
                var point = this.getElementAtEvent(e);
                if (point.length) e.target.style.cursor = 'pointer';
                else e.target.style.cursor = 'default';
            }
        },
        tooltips: {
            enabled: false,

            custom: tooltipModel => {
                if (tooltipModel.opacity === 0) {
                    this.tooltip = this.total;
                    return;
                }
                if (tooltipModel.body) {
                    // prettier-ignore
                    this.tooltip = (<string[]>tooltipModel.body[0].lines[0].split(':'))
                                        .map(x => numberWithSeperator(x.trim()));
                } else {
                    this.tooltip = this.total;
                }
            }
        }
    };

    public colors: Color[] = [{}];
    public tooltip: string[];
    private total: string[];
    private totalUnit: IUnit<IAsset>;

    @Output() edit: EventEmitter<{}> = new EventEmitter();
    public onEdit() {
        this.edit.emit();
    }

    @Input() public chartType: string = 'doughnut';
    @Input() public color: string = '';
    @Input() public title: string = '';
    @Input()
    public set units(value: IUnit<IAsset>[]) {
        value = array(value);
        value.forEach(val => (val.elements = array(val.elements)));

        this.total = [
            'Total',
            numberWithSeperator(
                value
                    .map(x =>
                        array(x.elements)
                            .map(y => y.value)
                            .reduce((a, b) => a + b, 0)
                    )
                    .reduce((a, b) => a + b, 0)
            )
        ];
        this.tooltip = this.total;

        this.datasets = [
            {
                data: value.map(x =>
                    array(x.elements)
                        .map(y => y.value)
                        .reduce((a, b) => a + b, 0)
                ),
                backgroundColor: value.map(
                    (x, i) =>
                        `rgba(255,255,255,${0.5 + i / (2 * value.length)})`
                ),
                hoverBackgroundColor: value.map(x => '#fff'),
                borderColor: this.color ? this.color : 'transparent',
                hoverBorderColor: this.color ? this.color : 'transparent',
                borderWidth: 10
            }
        ];
        this.labels = value.map(x => x.name);
        this._units = value;

        this.totalUnit = {
            name: 'Total',
            elements: value.map(
                x =>
                    <IAsset>{
                        name: x.name,
                        value: x.elements
                            .map(x => x.value)
                            .reduce((a, b) => a + b, 0)
                    }
            )
        };

        this.unit = this.totalUnit;
    }
    public get units(): IUnit<IAsset>[] {
        return this._units;
    }

    public get isBase(): boolean {
        return this.unit == this.totalUnit;
    }

    private _units: IUnit<IAsset>[];

    public unit: IUnit<IAsset> = undefined;
    constructor() {}

    public back(): void {
        this.unit = this.totalUnit;
    }
    public itemClick(label: string): void {
        if (this.isBase) this.setUnitByName(label);
    }

    public chartClicked(e: any): void {
        if (!e || !e.active || !e.active[0]) {
            this.unit = this.totalUnit;
            return;
        }
        this.setUnitByName(e.active[0]._model.label);
    }

    private setUnitByName(label: string) {
        let filter = this.units.filter(x => x.name === label);
        this.unit = filter && filter[0] ? filter[0] : this.totalUnit;
    }
}
