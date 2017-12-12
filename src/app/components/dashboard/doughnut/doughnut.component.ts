import { Color, Colors } from 'ng2-charts';
import {
    Component,
    DoCheck,
    EventEmitter,
    HostListener,
    Input,
    IterableDiffer,
    IterableDiffers,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import { NamedValue, OverviewContainer } from '../../../common/file';
import { array, numberWithSeperator, toSum } from '../../../common/helper';

import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'dashboard-doughnut',
    templateUrl: 'doughnut.component.html',
    styleUrls: ['./doughnut.component.css']
})
export class DashboardDoughnutComponent implements OnInit, OnDestroy {
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
    private totalUnit: OverviewContainer;

    @Output() edit: EventEmitter<string> = new EventEmitter();
    public onEdit(tab: string) {
        this.edit.emit(tab);
    }

    @Input() public chartType: string = 'doughnut';
    @Input() public color: string = '';
    @Input() public label: string = '';
    @Input()
    public set units(value: OverviewContainer[]) {
        value = array(value);
        value.forEach(val => (val.elements = array(val.elements)));
        this._units = value;
        this.updateGraphic();
    }
    public get units(): OverviewContainer[] {
        return this._units;
    }

    @Input() public update: Observable<{}>;
    private updateSub: Subscription;

    ngOnDestroy(): void {}
    ngOnInit(): void {
        if (this.update)
            this.update.subscribe(x => {
                this.updateGraphic();
            });
    }

    private updateGraphic() {
        let value = this._units;

        this.total = [
            'Total',
            numberWithSeperator(value.map(x => x.value).reduce(toSum, 0))
        ];
        this.tooltip = this.total;

        this.datasets = [
            {
                data: value.map(x => x.value),
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

        this.totalUnit = {
            name: 'Total',
            elements: value.map(
                x =>
                    <NamedValue>{
                        name: x.name,
                        value: x.value
                    }
            ),
            value: value.map(x => x.value).reduce(toSum, 0)
        };

        this.unit = this.totalUnit;
    }

    public more: boolean = false;

    public get isBase(): boolean {
        return this.unit == this.totalUnit;
    }

    private _units: OverviewContainer[];
    public unit: OverviewContainer = undefined;

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
        let label = e.active[0]._model.label;
        this.more = this.getUnitByName(label) !== this.unit;
        this.setUnitByName(label);
    }

    public toggleTotals() {
        if (this.unit == this.totalUnit) {
            this.more = !this.more;
        } else {
            this.more = true;
        }
        this.unit = this.totalUnit;
    }

    private getUnitByName(label: string): OverviewContainer {
        let filter = this.units.filter(x => x.name === label);
        let newUnit = filter && filter[0] ? filter[0] : this.totalUnit;
        return newUnit;
    }
    private setUnitByName(label: string) {
        this.unit = this.getUnitByName(label);
    }
}
