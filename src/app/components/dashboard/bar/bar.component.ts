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
import {
    NamedValue,
    OverviewContainer,
    OverviewValue
} from '../../../common/file';
import { array, numberWithSeperator, toSum } from '../../../common/helper';

import { ConfigurationService } from '../../../services/configuration';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'dashboard-bar',
    templateUrl: 'bar.component.html',
    styleUrls: ['./bar.component.css']
})
export class DashboardBarComponent implements OnInit, OnDestroy {
    public datasets: Colors[] = [];
    public labels: string[];

    constructor(private config: ConfigurationService) {}

    public options: any = {
        scales: {
            xAxes: [
                {
                    display: false,
                    stacked: true
                }
            ],
            yAxes: [
                {
                    display: false,
                    stacked: true
                }
            ]
        },
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
                    this.tooltip = tooltipModel.title
                    .concat((<string[]>tooltipModel.body[0].lines[0].split(':'))
                        .map(x => numberWithSeperator(x.trim())));
                } else {
                    this.tooltip = this.total;
                }
            }
        }
    };

    /*
    public options: any = {
        scales: {
            
            xAxes: [
                {
                    display: false,
                    stacked: true
                }
            ],
            yAxes: [
                {
                    display: false,
                    stacked: true
                }
            ]
        },
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
                    this.tooltip = undefined;
                    return;
                }

                if (tooltipModel.body) {
                    // prettier-ignore
                    this.tooltip = (<string[]>tooltipModel.body[0].lines[0].split(':'))
                                        .map(x => numberWithSeperator(x.trim()));

                    this.tooltip.unshift(tooltipModel.title);
                } else {
                    this.tooltip = undefined;
                }
            }
        }
    };
    */
    public colors: Color[] = [{}];
    public tooltip: string[];
    private total: string[];
    private totalUnits: { key: string; value: OverviewContainer };

    @Output() edit: EventEmitter<string> = new EventEmitter();
    public onEdit(tab: string) {
        this.edit.emit(tab);
    }

    @Input() public chartType: string = 'bar';
    @Input() path: string = '';

    public color: string = '';
    public label: string = '';

    @Input()
    public set units(value: OverviewValue) {
        value.negativ = array(value.negativ);
        value.positiv = array(value.positiv);

        value.negativ.forEach(val => (val.elements = array(val.elements)));
        value.positiv.forEach(val => (val.elements = array(val.elements)));
        this._units = value;
        this.updateGraphic();
    }
    public get units(): OverviewValue {
        return this._units;
    }

    @Input() public update: Observable<{}>;
    private updateSub: Subscription;

    ngOnDestroy(): void {}
    ngOnInit(): void {
        this.label = this.config.getName(this.path);
        this.color = this.config.getColor(this.path);

        if (this.update)
            this.update.subscribe(x => {
                this.updateGraphic();
            });
    }

    private rgba(x: any) {
        // prettier-ignore
        return `${x.key == 'positiv' ? '255' : '0'},${x.key == 'positiv' ? '255' : '0'},${x.key == 'positiv' ? '255' : '0'}`;
    }

    private updateGraphic() {
        if (!this.units) return;
        this.total = ['Total', numberWithSeperator(this.units.value)];
        this.tooltip = this.total;

        let all = this.units.positiv
            .map(x => <any>{ name: x.name, value: x.value, key: 'positiv' })
            .concat(
                this.units.negativ.map(
                    x => <any>{ name: x.name, value: -x.value, key: 'negativ' }
                )
            );

        this.datasets = [
            {
                data: all.map(x => x.value),
                backgroundColor: all.map(
                    (x, i) =>
                        `rgba(${this.rgba(x)},${0.25 + i / (4 * all.length)})`
                ),
                hoverBackgroundColor: all.map(x => `rgba(${this.rgba(x)},0.5)`),
                borderColor: this.color ? this.color : 'transparent',
                hoverBorderColor: all.map(x => x.key),
                borderWidth: 0
            }
        ];

        this.labels = all.map(x => x.name);

        this.totalUnits = <any>{};
        this.totalUnits['total'] = {
            name: 'Total',
            elements: [
                <NamedValue>{
                    name: this.config.getName(`${this.path}.positiv`),
                    value: this.units.positiv
                        .map(x => x.value)
                        .reduce(toSum, 0),
                    key: 'positiv'
                },
                <NamedValue>{
                    name: this.config.getName(`${this.path}.negativ`),
                    value: this.units.negativ
                        .map(x => x.value)
                        .reduce(toSum, 0),
                    key: 'negativ'
                }
            ],
            value: 0
        };

        this.totalUnits['positiv'] = {
            name: this.config.getName(`${this.path}.positiv`),
            elements: this.units.positiv
        };
        this.totalUnits['negativ'] = {
            name: this.config.getName(`${this.path}.negativ`),
            elements: this.units.negativ
        };

        this.unit = this.totalUnits['total'];
    }

    public more: boolean = false;

    public get isBase(): boolean {
        return (
            this.unit == this.totalUnits['total'] ||
            this.unit == this.totalUnits['positiv'] ||
            this.unit == this.totalUnits['negativ']
        );
    }

    private _units: OverviewValue;
    public unit: OverviewContainer = undefined;

    public back(): void {
        if (this.unit == this.totalUnits[this.key]) this.key = 'total';
        this.unit = this.totalUnits[this.key];
    }

    private key: string = 'total';
    public itemClick(label: any): void {
        if (label.key) this.key = label.key;
        if (this.isBase) this.setUnitByName(this.key, label.name);
    }

    public chartClicked(e: any): void {
        if (!e || !e.active || !e.active[0]) {
            this.key = 'total';
            this.unit = this.totalUnits['total'];
            return;
        }

        this.key = e.active[0]._model.borderColor;
        let label = e.active[0]._model.label;

        this.more = this.getUnitByName(this.key, label) !== this.unit;
        this.setUnitByName(this.key, label);
    }

    public toggleTotals() {
        if (this.unit == this.totalUnits['total']) {
            this.more = !this.more;
        } else {
            this.more = true;
        }
        this.unit = this.totalUnits['total'];
    }

    private getUnitByName(key: string, label: string): OverviewContainer {
        if (this.units[key]) {
            let unit: OverviewContainer[] = this.units[key];
            let filter = unit.filter(x => x.name === label);
            return filter && filter[0] ? filter[0] : this.totalUnits[key];
        }

        return this.totalUnits['total'];
    }
    private setUnitByName(key: string, label: string) {
        this.unit = this.getUnitByName(key, label);
    }
}
