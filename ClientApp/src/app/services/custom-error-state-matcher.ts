import { Injectable } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';

/** Error state matcher that matches when a control is invalid and dirty. */
@Injectable()
export class CustomErrorStateMatcher implements ErrorStateMatcher {

    static errors: any = {};
    public name: string;
    static getErrors(name: string): any[] {
        if (CustomErrorStateMatcher.errors) {
            return CustomErrorStateMatcher.errors[name];
        }
    }
    isErrorState(
        control: FormControl | null,
        form: FormGroupDirective | NgForm | null
    ): boolean {
        const hasError = control.invalid && (control.dirty || control.touched);
        return hasError
            ? true
            : CustomErrorStateMatcher.errors &&
                  CustomErrorStateMatcher.errors[this.name] &&
                  CustomErrorStateMatcher.errors[this.name].length > 0;
    }
}
