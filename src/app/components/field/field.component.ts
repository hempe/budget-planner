import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { Router } from '@angular/router';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { retry } from 'rxjs/operators/retry';
import { ErrorStateMatcher } from '@angular/material';
import { CustomErrorStateMatcher } from '../../services/custom-error-state-matcher';

const noop = () => {};
const inputTypes = [
    'button',
    'checkbox',
    'color',
    'date',
    'datetime-local',
    'file',
    'hidden',
    'image',
    'month',
    'number',
    'password',
    'radio',
    'range',
    'reset',
    'search',
    'submit',
    'tel',
    'text',
    'time',
    'url',
    'week'
];
export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FieldComponent),
    multi: true
};

@Component({
    selector: 'field',
    templateUrl: './field.component.html',
    styleUrls: ['./field.component.css'],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class FieldComponent implements ControlValueAccessor, OnInit {
    ngOnInit(): void {
        this.matcher.name = this.name;
    }

    //The internal data model
    private innerValue: any = '';

    //Placeholders for the callbacks which are later provided
    //by the Control Value Accessor
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    constructor(private router: Router) {}

    //get accessor
    get value(): any {
        return this.innerValue;
    }

    //set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }

    //Set touched on blur
    onBlur() {
        this.onTouchedCallback();
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    @Input() public icon: string;
    @Input() public name: string;
    @Input() public type: string;

    public matcher: CustomErrorStateMatcher = new CustomErrorStateMatcher();

    private isInputType(type: string): string {
        if (inputTypes.indexOf(type) >= 0) return type;
    }
}
