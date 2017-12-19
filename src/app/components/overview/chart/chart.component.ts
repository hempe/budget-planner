import { BaseChartDirective, Color, Colors } from 'ng2-charts';
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
    Output,
    ViewChild
} from '@angular/core';
import {
    NamedValue,
    OverviewContainer,
    OverviewValue
} from '../../../common/file';
import {
    array,
    hexToRgb,
    numberWithSeperator,
    toSum
} from '../../../common/helper';

import { ConfigurationService } from '../../../services/configuration';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ResizeService } from '../../../services/resize';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'overview-chart',
    templateUrl: 'chart.component.html',
    styleUrls: ['./chart.component.css']
})
export class OverviewChartComponent implements OnInit, OnDestroy {
    public datasets: Colors[] = [];
    public labels: string[];

    private init: boolean = false;

    @ViewChild(BaseChartDirective) private _chart: BaseChartDirective;

    constructor(
        private config: ConfigurationService,
        private resizeService: ResizeService
    ) {}

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
                        maxTicksLimit: 6
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
        },
        deferred: {
            delay: 500
        }
    };

    public colors: Color[] = [{}];
    public tooltip: string[];
    private total: string[];

    @Input() public chartType: string = 'bar';
    @Input() path: string = '';

    public color: string = '';

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
    private resizeSub: Subscription;

    ngOnDestroy(): void {
        if (this.resizeSub) this.resizeSub.unsubscribe();
    }
    ngOnInit(): void {
        this.resizeSub = this.resizeService.resized.subscribe(x => {
            this.onResize();
        });
        this.color = this.config.getColor(this.path);
        this.init = true;
        this.updateGraphic();

        if (this.update)
            this.update.subscribe(x => {
                this.updateGraphic();
            });
    }

    @Output() edit: EventEmitter<string> = new EventEmitter();
    public chartClicked(e: any): void {
        if (!e || !e.active || !e.active[0] || !e.active[0]._model) {
            return;
        }
        let label = e.active[0]._model.label;
        if (this.edit) this.edit.emit(label);
    }

    private rgba(percent: number) {
        // prettier-ignore
        //        return `${x.key == 'positive' ? '255' : '0'},${x.key == 'positive' ? '255' : '0'},${x.key == 'positive' ? '255' : '0'}`;

        let addon = 10;
        return `rgba(${hexToRgb(this.color)
            .map(x => (x + addon < 255 ? x + addon : 255))
            .join(',')}, ${percent})`;
    }

    private updateGraphic() {
        if (!this.units || !this.init) return;
        this.total = [
            'Total',
            numberWithSeperator(this.units.map(x => x.value).reduce(toSum, 0))
        ];
        this.tooltip = this.total;

        this.datasets = [
            {
                data: this.units.map(x => x.value),
                //backgroundColor: this.color,
                //hoverBackgroundColor: this.color,

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
    private _units: OverviewContainer[];
}
