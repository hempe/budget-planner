import { Pipe, PipeTransform } from '@angular/core';

export function clone<T>(obj: T): T {
    if (obj !== null && typeof obj === 'object')
        return <any>JSON.parse(JSON.stringify(obj));
    return obj;
}
export function array<T>(arr: T[]): T[] {
    let array = [];
    if (!arr) return [];
    if ((<any>arr).constructor == Array) return arr;
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

export function makeid() {
    var text = '';
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 64; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

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
        if (c.length == 3) {
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
    if (isNaN(value)) return 0;
    return Number(value);
}

//used in reduce
export function toAvarage(
    total: number,
    amount: number,
    index: number,
    array: number[]
) {
    total += amount;
    if (index === array.length - 1) {
        return total / array.length;
    } else {
        return total;
    }
}

export function flat<T>(arrays: T[][]): T[] {
    return [].concat.apply([], arrays);
}

export function getCompare(property: string, direction: '' | 'asc' | 'desc') {
    return (v1, v2) => {
        function compare(a, b) {
            if (a == b) return 0;
            if (a == undefined) return -1;
            if (b == undefined) return 1;
            if (a[property] < b[property]) return -1;
            if (a[property] > b[property]) return 1;
            return 0;
        }

        let val = compare(v1, v2);
        return direction == 'desc' ? -val : val;
    };
}

export function unique(array: any[], byProperty?: string) {
    var arr = [];
    for (var i = 0; i < array.length; i++) {
        if (
            !arr.includes(array[i]) &&
            (!byProperty ||
                array.filter(
                    a =>
                        a == array[i] ||
                        (a != undefined &&
                            array[i] != undefined &&
                            a[byProperty] == array[i][byProperty])
                ))
        ) {
            arr.push(array[i]);
        }
    }
    return arr;
}
