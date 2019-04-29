import { Pipe, PipeTransform } from '@angular/core';
// tslint:disable:no-bitwise

export function clone<T>(obj: T): T {
    if (obj !== null && typeof obj === 'object') {
        return <any>JSON.parse(JSON.stringify(obj));
    }
    return obj;
}

export function array<T>(arr: T[]): T[] {
    const elements = [];
    if (!arr) { return []; }
    if ((<any>arr).constructor === Array) { return arr; }
    Object.keys(arr).forEach(key => {
        if (!isNaN(<any>key)) {
            elements[Number(key)] = arr[key];
        }
    });

    return elements;
}

export function numberWithSeperator(x: any) {
    x = toNumber(x);
    const seperator = '\'';
    if (isNaN(x)) { return x; }
    return Number(x)
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, seperator);
}

export function makeid() {
    let text = '';
    const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 64; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
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

export function hexToRgb(hex: string): number[] {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return [(c >> 16) & 255, (c >> 8) & 255, c & 255];
    }
    throw new Error('Bad Hex');
}

export function toSum(a: number, b: number) {
    return toNumber(a) + toNumber(b);
}

export function toNumber(value: any): number {
    if (typeof value === 'string') {
        value = value.replace(/[^\d.-]/g, '');
    }
    if (isNaN(value)) { return 0; }
    return Number(value);
}

// used in reduce
export function toAvarage(
    total: number,
    amount: number,
    index: number,
    elements: number[]
) {
    total += amount;
    if (index === elements.length - 1) {
        return total / elements.length;
    } else {
        return total;
    }
}

export function flat<T>(arrays: T[][]): T[] {
    return [].concat.apply([], arrays);
}

export function getCompare(
    property: string,
    direction: '' | 'asc' | 'desc'
): (v1: any, v2: any) => number {
    return (v1, v2) => {
        function compare(a, b) {
            if (a === b) { return 0; }
            if (a === undefined) { return -1; }
            if (b === undefined) { return 1; }
            if (a[property] < b[property]) { return -1; }
            if (a[property] > b[property]) { return 1; }
            return 0;
        }

        const val = compare(v1, v2);
        return direction === 'desc' ? -val : val;
    };
}

export function getTransformCompare(
    property: string,
    direction: '' | 'asc' | 'desc',
    transform: (x: any) => any
): (v1: any, v2: any) => number {
    return (v1, v2) => {
        function compare(a, b) {
            if (a === b) { return 0; }
            if (a === undefined) { return -1; }
            if (b === undefined) { return 1; }
            const a1 = transform(a[property]);
            const b1 = transform(b[property]);
            if (a1 < b1) { return -1; }
            if (a1 > b1) { return 1; }
            return 0;
        }

        const val = compare(v1, v2);
        return direction === 'desc' ? -val : val;
    };
}

export function unique(elements: any[], byProperty?: string) {
    const arr = [];
    for (let i = 0; i < elements.length; i++) {
        if (
            !arr.includes(elements[i]) &&
            (!byProperty ||
                elements.filter(
                    a =>
                        a === elements[i] ||
                        (a !== undefined &&
                            elements[i] !== undefined &&
                            a[byProperty] === elements[i][byProperty])
                ))
        ) {
            arr.push(elements[i]);
        }
    }
    return arr;
}

export function isNumber(value: any) {
    return !isNaN(value) && value !== null && value !== undefined;
}
export function isNullOrWhitespace(value: any) {
    if (value === undefined || typeof value === 'undefined' || value == null) {
        return true;
    }
    return value.replace(/\s/g, '').length < 1;
}

export function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
