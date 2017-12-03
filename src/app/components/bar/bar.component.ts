import { Color, Colors } from 'ng2-charts';
import {
    Component,
    EventEmitter,
    HostListener,
    Input,
    Output
} from '@angular/core';
import {
    Files,
    IAsset,
    IBudget,
    IFile,
    IGroup,
    IUnit
} from '../../common/file';
import { array, numberWithSeperator } from '../../common/helper';

import { FileService } from '../../services/file-service';
import { Http } from '@angular/http';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';
import { MouseService } from '../../services/mouse';
import { TEST_JSON } from '../../common/testing/test';

@Component({
    selector: 'bar',
    templateUrl: 'bar.component.html',
    styleUrls: ['./bar.component.css']
})
export class BarComponent {
    public datasets: Colors[] = [];
    public labels: string[];
    public current: { name: string; value?: number }[];

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

    public colors: Color[] = [{}];
    public tooltip: string[];

    @Output() edit: EventEmitter<{}> = new EventEmitter();
    public onEdit() {
        this.edit.emit();
    }

    @Input() public chartType: string = 'bar';
    @Input() public color: string = '';
    @Input() public label: string = '';
    @Input()
    public set units(value: IGroup<IBudget>[]) {
        value = array(value);

        value.forEach(val => {
            val.positiv = array(val.positiv);
            val.positiv.forEach(v => (v.elements = array(v.elements)));

            val.negativ = array(val.negativ);
            val.negativ.forEach(v => (v.elements = array(v.elements)));
        });

        let incomes = value.map(b =>
            b.positiv
                .map(c =>
                    c.elements
                        .map(x => x.value * x.frequency)
                        .reduce((a, b) => a + b, 0)
                )
                .reduce((a, b) => a + b, 0)
        );
        let expenses = value.map(b =>
            b.negativ
                .map(c =>
                    c.elements
                        .map(x => -x.value * x.frequency)
                        .reduce((a, b) => a + b, 0)
                )
                .reduce((a, b) => a + b, 0)
        );

        let difference = incomes.map((v, i) => expenses[i] + v);

        this.datasets = [
            <Colors>{
                data: incomes,
                label: 'Income',
                backgroundColor: `rgba(255,255,255,${0.4})`,

                borderColor: 'transparent',
                hoverBorderColor: 'transparent',
                borderWidth: 0
            },
            <Colors>{
                data: expenses,
                label: 'Expenses',
                backgroundColor: `rgba(255,255,255,${0.3})`,

                borderColor: 'transparent',
                hoverBorderColor: 'transparent',
                borderWidth: 0
            }
        ];

        // this shoud be the budget names
        this.labels = value.map(x => x.name);
        this._units = value;
        this.current = value;
    }
    public get units(): IGroup<IBudget>[] {
        return this._units;
    }

    public get isBase(): boolean {
        return this.current === this.units;
    }

    private _units: IGroup<IBudget>[];

    public unit: IUnit<IAsset> = undefined;
    public current_name = '';
    constructor() {}

    public back(): void {
        this.current = this.units;
        this.current_name = undefined;
        return;
    }
    public itemClick(label: string): void {
        this.setUnitByName(label);
    }

    public chartClicked(e: any): void {
        if (!e || !e.active || !e.active[0]) {
            return;
        }
        this.setUnitByName(e.active[0]._model.label);
    }

    private setUnitByName(label: string) {
        let val = this.current_name ? this.current_name : label;
        let filter = this.units.filter(x => x.name === val);
        if (filter && filter[0]) {
            if (this.current_name) {
                this.current = (label == 'Income'
                    ? filter[0].positiv
                    : filter[0].negativ
                ).map(
                    x =>
                        <any>{
                            name: x.name,
                            value: x.elements
                                .map(x => x.value)
                                .reduce((a, b) => a + b, 0)
                        }
                );
            } else {
                this.current_name = filter[0].name;

                this.current = [
                    {
                        name: 'Income',
                        value: filter[0].positiv
                            .map(c =>
                                c.elements
                                    .map(x => x.value * x.frequency)
                                    .reduce((a, b) => a + b, 0)
                            )
                            .reduce((a, b) => a + b, 0)
                    },
                    {
                        name: 'Expenses',
                        value: filter[0].negativ
                            .map(c =>
                                c.elements
                                    .map(x => x.value * x.frequency)
                                    .reduce((a, b) => a + b, 0)
                            )
                            .reduce((a, b) => a + b, 0)
                    }
                ];
            }
        } else {
            this.current_name = undefined;
            this.current = this.units;
        }
    }
}
