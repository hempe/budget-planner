import { Pipe, PipeTransform } from '@angular/core';

export function clone<T>(obj: T): T {
    if (obj !== null && typeof obj === 'object')
        return <any>JSON.parse(JSON.stringify(obj));
    return obj;
}
export function array<T>(arr: T[]): T[] {
    let array = [];
    Object.keys(arr).forEach(key => {
        if (!isNaN(<any>key)) {
            array[Number(key)] = arr[key];
        }
    });

    return array;
}

export function numberWithSeperator(x: any) {
    let seperator = "'";
    if (isNaN(x)) return x;
    return Number(x)
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, seperator);
}

/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | numberWithSeperator:seperator
 * Example:
 *   {{ 1024 | numberWithSeperator }}
 *   formats to: 1'024.00
*/
@Pipe({ name: 'numberWithSeperator' })
export class NumberWithSeperatorPipe implements PipeTransform {
    transform(value: number): number {
        return numberWithSeperator(value);
    }
}
