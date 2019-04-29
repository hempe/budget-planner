import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { BaseChartDirective, Color, Colors } from 'ng2-charts';
import { Observable, Subscription } from 'rxjs';
import { OverviewContainer } from '../../../common/api';
import { array, hexToRgb, numberWithSeperator, toSum } from '../../../common/helper';
import { ConfigurationService } from '../../../services/configuration';
import { ResizeService } from '../../../services/resize';

@Component({
    selector: 'overview-chart',
    templateUrl: 'chart.component.html',
    styleUrls: ['./chart.component.css']
})
export class OverviewChartComponent implements OnInit, OnDestroy {

    constructor(
        private config: ConfigurationService,
        private resizeService: ResizeService
    ) {}

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
    public datasets: Colors[] = [];
    public labels: string[];

    private init = false;

    @ViewChild(BaseChartDirective) private _chart: BaseChartDirective;

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
                        maxTicksLimit: 6,
                        beginAtZero: true
                    }
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
                if (point.length) { e.target.style.cursor = 'pointer'; } else { e.target.style.cursor = 'default'; }
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
        },
        deferred: {
            delay: 500
        }
    };

    public colors: Color[] = [{}];
    public tooltip: string[];
    private total: string[];

    @Input() public chartType = 'bar';
    @Input() path = '';

    public color = '';

    @Input() public update: Observable<{}>;
    private resizeSub: Subscription;

    @Output() edit: EventEmitter<string> = new EventEmitter();
    private _units: OverviewContainer[];

    ngOnDestroy(): void {
        if (this.resizeSub) { this.resizeSub.unsubscribe(); }
    }
    ngOnInit(): void {
        this.resizeSub = this.resizeService.resized.subscribe(x => {
            this.onResize();
        });
        this.color = this.config.getColor(this.path);
        this.init = true;
        this.updateGraphic();

        if (this.update) {
            this.update.subscribe(x => {
                this.updateGraphic();
            });
        }
    }
    public chartClicked(e: any): void {
        if (!e || !e.active || !e.active[0] || !e.active[0]._model) {
            return;
        }
        const label = e.active[0]._model.label;
        if (this.edit) { this.edit.emit(label); }
    }

    private rgba(percent: number) {
        // prettier-ignore
        //        return `${x.key == 'positive' ? '255' : '0'},${x.key == 'positive' ? '255' : '0'},${x.key == 'positive' ? '255' : '0'}`;

        const addon = 10;
        return `rgba(${hexToRgb(this.color)
            .map(x => (x + addon < 255 ? x + addon : 255))
            .join(',')}, ${percent})`;
    }

    private updateGraphic() {
        if (!this.units || !this.init) { return; }
        this.total = [
            'Total',
            numberWithSeperator(this.units.map(x => x.value).reduce(toSum, 0))
        ];
        this.tooltip = this.total;

        this.datasets = [
            {
                data: this.units.map(x => x.value),
                // backgroundColor: this.color,
                // hoverBackgroundColor: this.color,

                backgroundColor: this.units.map((x, i) =>
                    this.rgba(0.5 + i / (2 * this.units.length))
                ),
                hoverBackgroundColor: this.units.map((x, i) =>
                    this.rgba(0.5 + i / (2 * this.units.length))
                ),

                borderColor: this.color ? this.color : 'transparent',
                hoverBorderColor: this.color ? this.color : 'transparent',
                borderWidth: 0
            }
        ];

        this.labels = this.units.map(x => x.name);
        this.onResize();
    }

    private onResize() {
        setTimeout(() => {
            if (this._chart && this._chart.chart) {
                this._chart.chart.resize();
                this._chart.chart.update();
            }
        }, 0);
    }
}
