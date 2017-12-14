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
    DatedValue,
    FrequencyValue,
    NamedValue,
    Unit
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
    selector: 'edit-chart',
    templateUrl: 'chart.component.html',
    styleUrls: ['./chart.component.css']
})
export class EditChartComponent implements OnInit, OnDestroy {
    @Input() public chartType: string = 'doughnut';
    @Input() public color: string = '';
    @Input() public label: string = '';
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

    @Output() edit: EventEmitter<string> = new EventEmitter();
    public onEdit(tab: string) {
        this.edit.emit(tab);
    }

    private updateSub: Subscription;

    ngOnDestroy(): void {
        if (this.updateSub) this.updateSub.unsubscribe();
    }
    ngOnInit(): void {
        if (this.update)
            this.updateSub = this.update.subscribe(x => {
                this.updateGraphic();
            });
    }

    private updateGraphic() {
        if (!this._units || this._units.length <= 0) return;
        let value = this._units;

        var sets = value.map(x =>
            x.elements.map(x => this.getValue(x)).reduce(toSum, 0)
        );

        let total = sets.reduce(toSum, 0);

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

    private _units: Unit<NamedValue | FrequencyValue | DatedValue>[];

    public chartClicked(e: any): void {
        if (!e || !e.active || !e.active[0]) {
            return;
        }

        let label = e.active[0]._model.label;
        this.onEdit(label);
    }

    private getValue(x: NamedValue | FrequencyValue | DatedValue) {
        if (this.type == 'budget')
            return x.value * (<FrequencyValue>x).frequency;
        return x.value;
    }
}
