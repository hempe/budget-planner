import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { BaseChartDirective, Color, Colors } from 'ng2-charts';
import { Observable, Subscription } from 'rxjs';
import { DatedValue, FrequencyValue, NamedValue, Unit } from '../../../common/api';
import { array, numberWithSeperator, toSum } from '../../../common/helper';

@Component({
    selector: 'edit-chart',
    templateUrl: 'chart.component.html',
    styleUrls: ['./chart.component.css']
})
export class EditChartComponent implements OnInit, OnDestroy {
    @Input()
    public set units(value: Unit<NamedValue | FrequencyValue | DatedValue>[]) {
        value = array(value);
        value.forEach(val => (val.elements = array(val.elements)));
        this._units = value;
        this.updateGraphic();
    }
    public get units(): Unit<NamedValue | FrequencyValue | DatedValue>[] {
        return this._units;
    }
    @Input() public chartType = 'doughnut';
    @Input() public color = '';
    @Input() public label = '';

    @Input() public update: Observable<{}>;
    @Input() public type: string;

    public datasets: Colors[] = [];
    public labels: string[];
    public colors: Color[] = [{}];
    public tooltip: string[];
    private total: string[];

    @ViewChild(BaseChartDirective) private _chart: BaseChartDirective;

    public options: any = {
        maintainAspectRatio: false,
        responsive: false,
        legend: {
            display: false
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
                    this.tooltip = (<string[]>tooltipModel.body[0].lines[0].split(':'))
                                        .map(x => numberWithSeperator(x.trim()));
                } else {
                    this.tooltip = this.total;
                }
            }
        }
    };

    @Output() edit: EventEmitter<string> = new EventEmitter();

    private updateSub: Subscription;

    private _units: Unit<NamedValue | FrequencyValue | DatedValue>[];
    public onEdit(tab: string) {
        this.edit.emit(tab);
    }

    ngOnDestroy(): void {
        if (this.updateSub) { this.updateSub.unsubscribe(); }
    }
    ngOnInit(): void {
        if (this.update) {
            this.updateSub = this.update.subscribe(x => {
                this.updateGraphic();
            });
        }
    }

    private updateGraphic() {
        if (!this._units || this._units.length <= 0) { return; }
        const value = this._units;

        const sets = value.map(x =>
            x.elements.map(y => this.getValue(y)).reduce(toSum, 0)
        );

        const total = sets.reduce(toSum, 0);

        this.total = ['Total', numberWithSeperator(total)];
        this.tooltip = this.total;

        this.datasets = [
            {
                data: sets,
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

        setTimeout(() => {
            if (this._chart && this._chart.chart) {
                this._chart.chart.update();
            }
        }, 0);
    }

    public chartClicked(e: any): void {
        if (!e || !e.active || !e.active[0]) {
            return;
        }

        const label = e.active[0]._model.label;
        this.onEdit(label);
    }

    private getValue(x: NamedValue | FrequencyValue | DatedValue) {
        if (this.type === 'budgets') {
            return x.value * (<FrequencyValue>x).frequency;
        }
        return x.value;
    }
}
