import { Color, Colors } from 'ng2-charts';
import {
    Component,
    DoCheck,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    IterableDiffer,
    IterableDiffers,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import { DashboardConfig, Themes } from '../dashboard';
import {
    NamedValue,
    OverviewContainer,
    OverviewValue,
    UnitKey
} from '../../../common/api';
import {
    array,
    hexToRgb,
    isNullOrWhitespace,
    numberWithSeperator,
    toSum
} from '../../../common/helper';

import { ActivatedRoute } from '@angular/router/src/router_state';
import { ConfigurationService } from '../../../services/configuration';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ResizeService } from '../../../services/resize';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'dashboard-bar',
    templateUrl: 'bar.component.html',
    styleUrls: ['./bar.component.css']
})
export class DashboardBarComponent implements OnInit, OnDestroy {
    constructor(
        private http: Http,
        private configService: ConfigurationService,
        private router: Router
    ) {}

    @HostBinding('style.display') display: string = 'block';

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
                    this.tooltip = this._total;
                    return;
                }
                if (tooltipModel.body) {
                    // prettier-ignore
                    this.tooltip = tooltipModel.title
                    .concat((<string[]>tooltipModel.body[0].lines[0].split(':'))
                        .map(x => numberWithSeperator(x.trim())));
                } else {
                    this.tooltip = this._total;
                }
            }
        },
        deferred: {
            yOffset: '20%',
            delay: 500
        }
    };

    @Input() public config: DashboardConfig;

    public chartType: string = 'bar';
    public color: string = '';
    public colors: Color[] = [{}];
    public datasets: Colors[] = [];
    public label: string = '';
    public labels: string[];
    public loaded: boolean = false;
    public more: boolean = false;
    public tooltip: string[];
    public unit: OverviewContainer = undefined;

    private _colorPositiv = '';
    private _colorNegativ = '';
    private _total: string[];
    private _totalUnits: { key: string; value: OverviewContainer };
    private _units: OverviewValue;
    private _key: string = 'total';

    public set units(value: OverviewValue) {
        if (!value) return;
        value.negative = array(value.negative);
        value.positive = array(value.positive);

        value.negative.forEach(val => (val.elements = array(val.elements)));
        value.positive.forEach(val => (val.elements = array(val.elements)));
        this._units = value;
    }

    public get units(): OverviewValue {
        return this._units;
    }
    public get theme(): string {
        return this.config ? this.config.theme : '';
    }

    public get isBase(): boolean {
        return (
            this.unit == this._totalUnits[UnitKey.total] ||
            this.unit == this._totalUnits[UnitKey.positive] ||
            this.unit == this._totalUnits[UnitKey.negative]
        );
    }

    public onEdit(tab: string) {
        let route = [].concat(this.config.path.split('.'));
        if (!isNullOrWhitespace(this.config.id)) {
            route.push(this.config.id);
        }
        if (this._key != UnitKey.total) {
            route.push(this._key);
            if (tab) route.push(<any>{ tab: tab });
        }
        this.router.navigate(route);
    }

    public back(): void {
        if (this.unit == this._totalUnits[this._key]) this._key = UnitKey.total;
        this.unit = this._totalUnits[this._key];
    }

    public itemClick(label: any): void {
        if (label.key) this._key = label.key;
        if (this.isBase) this.setUnitByName(this._key, label.name);
    }

    public chartClicked(e: any): void {
        if (!e || !e.active || !e.active[0]) {
            this._key = UnitKey.total;
            this.unit = this._totalUnits[this._key];
            return;
        }

        this._key = e.active[0]._model.borderColor;
        let label = e.active[0]._model.label;

        this.more = this.getUnitByName(this._key, label) !== this.unit;
        this.setUnitByName(this._key, label);
    }

    public toggleTotals() {
        if (this.unit == this._totalUnits[UnitKey.total]) {
            this.more = !this.more;
        } else {
            this.more = true;
        }
        this.unit = this._totalUnits[UnitKey.total];
    }

    public ngOnDestroy(): void {}

    public ngOnInit(): void {
        if (!this.config) return;
        let url = !isNullOrWhitespace(this.config.id)
            ? `api/data/${this.config.path}/${this.config.id}`
            : `api/data/${this.config.path}`;

        this.http
            .get(url)
            .map(x => x.json())
            .subscribe((x: OverviewValue) => {
                this.units = x;

                this.label = x.name; // this.configService.getName(this.config.path);

                this.color =
                    this.config.theme == Themes.light
                        ? '#fff'
                        : this.configService.getColor(this.config.path);

                this._colorPositiv = this.configService.getColor(
                    this.config.path,
                    UnitKey.positive
                );

                this._colorNegativ = this.configService.getColor(
                    this.config.path,
                    UnitKey.negative
                );

                this.updateGraphic();
                this.loaded = true;
            });
    }

    public unpin() {
        let url = !isNullOrWhitespace(this.config.id)
            ? `api/data/dashboard/${this.config.path}/${this.config.id}`
            : `api/data/dashboard/${this.config.path}`;
        this.http.delete(url).subscribe(x => this.reload());
        this.display = 'none';
    }

    private reload() {
        this.router.navigated = false;
        this.router.navigate(['./']);
    }

    private rgba(x: any) {
        var arr: number[];
        if (this.config.theme == Themes.light) {
            arr =
                x.key == UnitKey.positive
                    ? hexToRgb(this._colorPositiv)
                    : hexToRgb(this._colorNegativ);
        } else {
            let v = x.key == UnitKey.positive ? 255 : 0;
            arr = [v, v, v];
        }
        return arr.join(',');
    }

    private updateGraphic() {
        if (!this.units) return;
        this._total = ['Total', numberWithSeperator(this.units.value)];
        this.tooltip = this._total;

        let all = this.units.positive
            .map(
                x =>
                    <any>{ name: x.name, value: x.value, key: UnitKey.positive }
            )
            .concat(
                this.units.negative.map(
                    x =>
                        <any>{
                            name: x.name,
                            value: -x.value,
                            key: UnitKey.negative
                        }
                )
            );

        this.datasets = [
            {
                data: all.map(x => x.value),
                backgroundColor: all.map(
                    (x, i) =>
                        this.config.theme == Themes.light
                            ? `rgb(${this.rgba(x)})`
                            : `rgba(${this.rgba(x)},${0.25 +
                                  i / (4 * all.length)})`
                ),
                hoverBackgroundColor: all.map(x => `rgba(${this.rgba(x)},0.5)`),
                borderColor: this.color ? this.color : 'transparent',
                hoverBorderColor: all.map(x => x.key),
                borderWidth: 0
            }
        ];

        this.labels = all.map(x => x.name);

        this._totalUnits = <any>{};
        let pos = {};
        let neg = {};

        this._totalUnits[UnitKey.total] = {
            name: 'Total',
            elements: [
                <NamedValue>{
                    name: this.configService.getTranslatedName(
                        this.config.path,
                        UnitKey.positive
                    ),
                    value: this.units.positive
                        .map(x => x.value)
                        .reduce(toSum, 0),
                    key: UnitKey.positive
                },
                <NamedValue>{
                    name: this.configService.getTranslatedName(
                        this.config.path,
                        UnitKey.negative
                    ),
                    value: this.units.negative
                        .map(x => x.value)
                        .reduce(toSum, 0),
                    key: UnitKey.negative
                }
            ],
            value: 0
        };

        this._totalUnits[UnitKey.positive] = {
            name: this.configService.getTranslatedName(
                this.config.path,
                UnitKey.positive
            ),
            elements: this.units.positive
        };
        this._totalUnits[UnitKey.negative] = {
            name: this.configService.getTranslatedName(
                this.config.path,
                UnitKey.negative
            ),
            elements: this.units.negative
        };

        this.unit = this._totalUnits[UnitKey.total];
    }

    private getUnitByName(key: string, label: string): OverviewContainer {
        if (this.units[key]) {
            let unit: OverviewContainer[] = this.units[key];
            let filter = unit.filter(x => x.name === label);
            return filter && filter[0] ? filter[0] : this._totalUnits[key];
        }

        return this._totalUnits[UnitKey.total];
    }

    private setUnitByName(key: string, label: string) {
        this.unit = this.getUnitByName(key, label);
    }
}
