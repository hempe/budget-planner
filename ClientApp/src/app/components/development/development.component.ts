import { Component, EventEmitter, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Colors } from 'ng2-charts';
import { map } from 'rxjs/operators';
import { DevelopmentElement } from '../../common/api';
import {
    clone,
    hexToRgb,
    isNullOrWhitespace,
    numberWithSeperator,
    toSum
} from '../../common/helper';
import { ConfigurationService } from '../../services/configuration';
import {
    DataSourceColumn,
    DataSourceFactory,
    ListDataSource
} from '../../services/data-source-wrapper';
import { MouseService } from '../../services/mouse';
import { DashboardConfig } from '../dashboard/dashboard';
import { ThemeSelector } from '../theme-selector/theme-selector.component';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';

@Component({
    selector: 'development',
    templateUrl: 'development.component.html',
    styleUrls: ['development.component.css']
})
export class DevelopmentComponent implements OnInit {
    public theme: string;
    public value: DevelopmentElement[];
    public dev: any[];
    public year: number;
    public tooltip: {
        year: number;
        group: string;
        value: string;
        icon: string;
        top: any;
        left: any;
    };

    public head: MenuEntry = {
        icon: 'arrow_back',
        name: 'Development',
        action: () => this.router.navigate(['../'], { relativeTo: this.route })
    };

    public options: any = {
        scales: {
            xAxes: [
                {
                    gridLines: {
                        display: false
                    },
                    scaleLabel: {
                        display: false
                    },
                    ticks: {
                        fontColor: 'rgba(0,0,0,0.54)',
                        fontSize: 12,
                        fontFamily: 'roboto',
                        padding: 6
                    },
                    stacked: true,
                    type: 'time',
                    time: {
                        displayFormats: {
                            quarter: 'MMM YYYY'
                        }
                    }
                }
            ],
            yAxes: [
                {
                    gridLines: {
                        display: true,
                        color: 'rgba(0,0,0,0.2)',
                        drawTicks: false,
                        tickMarkLength: 100,
                        offsetGridLines: false,
                        drawBorder: false,
                        borderDashOffset: 100
                    },
                    scaleLabel: {
                        display: false
                    },
                    ticks: {
                        fontColor: 'rgba(0,0,0,0.54)',
                        fontSize: 12,
                        fontFamily: 'roboto',
                        padding: 24,
                        maxTicksLimit: 10,
                        callback: (value: any) => {
                            if (Math.floor(value) === value) {
                                return numberWithSeperator(value);
                            }
                        }
                    },
                    stacked: true
                }
            ]
        },
        maintainAspectRatio: false,
        responsive: true,
        legend: {
            display: false
        },
        elements: {
            rectangle: {
                borderSkipped: 'left'
            }
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
        deferred: {
            delay: 500
        },
        tooltips: {
            enabled: false,

            custom: tooltipModel => {
                if (tooltipModel.opacity === 0) {
                    this.tooltip = undefined;
                    return;
                }
                try {
                    const year = new Date(tooltipModel.title[0]).getFullYear();
                    const line = tooltipModel.body[0].lines[0].split(':');
                    const group = this.config.getTranslatedName(line[0].trim());
                    const icon = this.config.getIcon(line[0].trim());
                    const value = numberWithSeperator(line[1].trim());

                    this.tooltip = {
                        year: year,
                        group: group,
                        value: value,
                        icon: icon,
                        top: this.mouse.getY() + 20 + 'px',
                        left: this.mouse.getX() + 20 + 'px'
                    };
                } catch (err) {
                    console.error('Could not create tootlip', err);
                }
            }
        }
    };

    public labels: string[];
    public datasetsOne: Colors[];
    public datasetsTwo: Colors[];
    public datasetsThree: Colors[];

    public colors = [{}];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private http: Http,
        private config: ConfigurationService,
        private mouse: MouseService,
        private themeSelector: ThemeSelector
    ) {}

    public columns: DataSourceColumn[] = [
        {
            key: 'type',
            name: 'type',
            type: 'icon',
            map: {
                budgets: 'trending_up',
                assets: 'attach_money',
                revenue: 'date_range'
            }
        },
        /*{ key: 'group', name: 'group', type: 'text' },*/
        { key: 'name', name: 'name', type: 'text' },
        { key: 'value', name: 'amount', type: 'number' },
        { key: 'start', name: 'startYear', type: 'number' },
        { key: 'end', name: 'endYear', type: 'number' }
    ];

    public dataSource: DataSourceFactory<any, any>;
    public valueEmitter = new EventEmitter<DevelopmentElement[]>();

    ngOnInit() {
        this.dataSource = ref =>
            new ListDataSource(this.valueEmitter.asObservable(), ref);

        this.http
            .get('/api/development')
            .pipe(map(x => x.json()))
            .subscribe(x => this.setValue(x));

        this.http
            .get('/api/dashboard/development')
            .pipe(map(x => x.json()))
            .subscribe(x => (this.theme = x.theme));
    }

    public pin() {
        if (this.theme) {
            this.http
                .delete('/api/dashboard/development')
                .subscribe(x => (this.theme = undefined));
        } else {
            this.themeSelector.selectTheme().subscribe(theme => {
                this.http
                    .post('/api/dashboard', <DashboardConfig>{
                        path: `development`,
                        theme: theme,
                        type: 'icon',
                        icon: 'insert_chart'
                    })
                    .pipe(map(x => x.json()))
                    .subscribe(x => (this.theme = x.theme));
            });
        }
    }

    public setValue(value: DevelopmentElement[]) {
        this.value = value;
        this.year = undefined;

        const start = Math.min.apply(
            null,
            this.value.filter(x => x.start > 0).map(x => x.start)
        );

        const end = Math.max.apply(null, this.value.map(x => x.end));
        console.info('Start: %o End: %o', start, end, this.value);

        this.labels = [];
        this.dev = [];
        let index = 0;
        const startValues = this.value
            .filter(x => !x.start && !x.end)
            .map(x => x);

        const startValue =
            startValues.length > 0
                ? startValues.map(x => x.value).reduce(toSum)
                : 0;

        for (let year = start; year <= end; year++) {
            // Current elements?
            const values = this.value
                .filter(x => x.start <= year && x.end >= year)
                .map(x => x.value);

            const revenues = this.value
                .filter(
                    x =>
                        x.start <= year && x.end >= year && x.type === 'revenue'
                )
                .map(x => x.value);

            const revenue =
                revenues && revenues.length ? revenues.reduce(toSum) : 0;

            let v = values && values.length ? values.reduce(toSum) : 0;
            const current = v;
            if (index > 0) {
                v += this.dev[index - 1].value;
            } else {
                v += startValue;
            }

            this.dev.push({
                year: year,
                value: v,
                current: current,
                revenue: revenue
            });
            index++;
        }

        this.datasetsOne = [
            {
                label: 'budgets.positive',
                data: this.dev.map(
                    x =>
                        <any>{
                            x: new Date(x.year, 0),
                            y:
                                x.current - x.revenue > 0
                                    ? x.current - x.revenue
                                    : 0
                        }
                ),
                backgroundColor: this.rgba(
                    this.config.getColor('budgets.positive')
                )
            },
            {
                label: 'budgets.negative',
                data: this.dev.map(
                    x =>
                        <any>{
                            x: new Date(x.year, 0),
                            y:
                                x.current - x.revenue < 0
                                    ? x.current - x.revenue
                                    : 0
                        }
                ),
                backgroundColor: this.rgba(
                    this.config.getColor('budgets.negative')
                )
            }
        ];
        this.datasetsTwo = [
            {
                label: 'revenue.positive',
                data: this.dev.map(
                    x =>
                        <any>{
                            x: new Date(x.year, 0),
                            y: x.revenue > 0 ? x.revenue : 0
                        }
                ),
                backgroundColor: this.rgba(
                    this.config.getColor('revenue.positive')
                )
            },
            {
                label: 'revenue.negative',
                data: this.dev.map(
                    x =>
                        <any>{
                            x: new Date(x.year, 0),
                            y: x.revenue < 0 ? x.revenue : 0
                        }
                ),
                backgroundColor: this.rgba(
                    this.config.getColor('revenue.negative')
                )
            }
        ];
        this.datasetsThree = [
            <any>{
                label: 'assets',
                data: this.dev.map(
                    x =>
                        <any>{
                            x: new Date(x.year, 0),
                            y: x.value
                        }
                ),
                type: 'line'
            }
        ];

        this.labels = this.dev.map(x => x.year);
        this.valueEmitter.emit(this.toDataSource(this.value));
    }

    private toDataSource(values: any[]): any[] {
        return values.map(x => {
            const y = <any>clone(x);
            y.tab = x.name;
            y.value = numberWithSeperator(x.value);
            if (x.type === 'budgets') {
                y.name = x.group + ': ' + x.name;
                return y;
            }
            return y;
        });
    }

    private rgba(color: string) {
        try {
            return `rgba(${hexToRgb(color).join(',')}, 1)`;
        } catch (err) {
            return color;
        }
    }

    public selected(row: DevelopmentElement) {
        const route = [row.type];

        if (!isNullOrWhitespace(row.id)) {
            route.push(row.id);
        }
        route.push(row.subType);
        route.push(<any>{ tab: (<any>row).tab });

        this.router.navigate(route);
    }

    public chartClicked(e: any): void {
        if (!this.tooltip) {
            return;
        }
        this.year = this.tooltip.year;
        this.setYear();
    }

    public setYear(): void {
        if (!this.year) {
            this.year = undefined;
            this.valueEmitter.emit(this.toDataSource(this.value));
            return;
        }

        const filtered = this.value.filter(
            x => x.start <= this.year && x.end >= this.year
        );
        this.valueEmitter.emit(this.toDataSource(filtered));
    }
}
