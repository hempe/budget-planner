import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { Color, Colors } from 'ng2-charts';
import { map } from 'rxjs/operators';
import { NamedValue, OverviewContainer, OverviewValue } from '../../../common/api';
import { array, hexToRgb, isNullOrWhitespace, isNumber, numberWithSeperator, toSum } from '../../../common/helper';
import { ConfigurationService } from '../../../services/configuration';
import { ResizeService } from '../../../services/resize';
import { DashboardConfig, Themes } from '../dashboard';

@Component({
    selector: 'dashboard-doughnut',
    templateUrl: 'doughnut.component.html',
    styleUrls: ['./doughnut.component.css']
})
export class DashboardDoughnutComponent implements OnInit, OnDestroy {
    constructor(
        private http: Http,
        private configService: ConfigurationService,
        private resizeService: ResizeService,
        private router: Router
    ) {}

    @HostBinding('style.display') display = 'block';
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
                const point = this.getElementAtEvent(e);
                if (point.length) {
                    e.target.style.cursor = 'pointer';
                } else {
                    e.target.style.cursor = 'default';
                }
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
                    this.tooltip = (<string[]>tooltipModel.body[0].lines[0].split(
                        ':'
                    )).map(x => isNumber(x) ? numberWithSeperator(x.trim()) : x.trim());
                } else {
                    this.tooltip = this.total;
                }
            }
        },
        deferred: {
            yOffset: '20%',
            delay: 500
        }
    };

    @Input()
    public config: DashboardConfig = {
        path: 'assets.positive',
        theme: Themes.light,
        type: 'doughnut'
    };

    public chartType = 'doughnut';
    public color = '';
    public colors: Color[] = [{}];
    public datasets: Colors[] = [];
    public labels: string[];
    public label = '';
    public loaded = false;
    public more = false;
    public tooltip: string[];
    public unit: OverviewContainer = undefined;

    private _units: OverviewContainer[];
    private total: string[];
    private totalUnit: OverviewContainer;

    public get theme(): string {
        return this.config ? this.config.theme : '';
    }

    public onEdit(tab: string) {
        const type = this.config.path.split('.');
        const route = [type[0]];

        if (!isNullOrWhitespace(this.config.id)) {
            route.push(<any>this.config.id);
        }

        route.push(type[1]);
        if (tab) {
            route.push(<any>{ tab: tab });
        }

        this.router.navigate(route);
    }

    public set units(value: OverviewContainer[]) {
        if (!value) {
            return;
        }
        value = array(value);
        value.forEach(val => (val.elements = array(val.elements)));
        this._units = value;
    }
    public get units(): OverviewContainer[] {
        return this._units;
    }

    public get isBase(): boolean {
        return this.unit === this.totalUnit;
    }

    public back(): void {
        this.unit = this.totalUnit;
    }
    public itemClick(label: string): void {
        if (this.isBase) {
            this.setUnitByName(label);
        }
    }

    public chartClicked(e: any): void {
        if (!e || !e.active || !e.active[0]) {
            this.unit = this.totalUnit;
            return;
        }
        const label = e.active[0]._model.label;
        this.more = this.getUnitByName(label) !== this.unit;
        this.setUnitByName(label);
    }

    public toggleTotals() {
        if (this.unit === this.totalUnit) {
            this.more = !this.more;
        } else {
            this.more = true;
        }
        this.unit = this.totalUnit;
    }

    public ngOnDestroy(): void {}
    public unpin() {
        const url = !isNullOrWhitespace(this.config.id)
            ? `api/dashboard/${this.config.path}/${this.config.id}`
            : `api/dashboard/${this.config.path}`;
        this.http.delete(url).subscribe(x => this.reload());
        this.display = 'none';
    }

    public ngOnInit(): void {
        if (!this.config) {
            return;
        }
        const type = this.config.path.split('.');
        const url = !isNullOrWhitespace(this.config.id)
            ? `api/${type[0]}/${this.config.id}`
            : `api/${type[0]}`;

        this.http
            .get(url)
            .pipe(map(x => x.json()))
            .subscribe((x: OverviewValue) => {
                this.units = x[type[1]];
                this.label = this.configService.getTranslatedName(
                    this.config.path
                );
                this.color =
                    this.config.theme === Themes.light
                        ? '#fff'
                        : this.configService.getColor(this.config.path);

                this.updateGraphic();
                this.loaded = true;
            });
    }

    private reload() {
        this.router.navigated = false;
        this.router.navigate(['./']);
    }

    private rgba(x: any) {
        let arr: number[];
        if (this.config.theme === Themes.light) {
            const c = this.configService.getColor(this.config.path);
            arr = hexToRgb(c);
        } else {
            arr = [255, 255, 255];
        }
        return arr.join(',');
    }

    private updateGraphic() {
        let value = this._units;
        if (value === undefined) {
            value = [];
            this.unpin();
        }

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
                        `rgba(${this.rgba(x)},${0.5 + i / (2 * value.length)})`
                ),
                hoverBackgroundColor:
                    this.config.theme === Themes.light
                        ? value.map(x => `rgba(${this.rgba(x)},0.5)`)
                        : value.map(x => '#fff'),
                borderColor: this.color ? this.color : 'transparent',
                hoverBorderColor: this.color ? this.color : 'transparent',
                borderWidth: this.config.theme === Themes.light ? 2 : 4
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

    private getUnitByName(label: string): OverviewContainer {
        const filter = this.units.filter(x => x.name === label);
        const newUnit = filter && filter[0] ? filter[0] : this.totalUnit;
        return newUnit;
    }
    private setUnitByName(label: string) {
        this.unit = this.getUnitByName(label);
    }
}
