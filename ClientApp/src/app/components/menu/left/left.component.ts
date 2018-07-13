import { Component, Input } from '@angular/core';

@Component({
    selector: 'menu-left',
    templateUrl: 'left.component.html',
    styleUrls: ['./left.component.css']
})
export class MenuLeftComponent {
    private _noTop = false;
    @Input()
    public set noTop(value: boolean) {
        this._noTop = value == true || <any>value == 'true';
    }
    public get noTop(): boolean {
        return this._noTop;
    }
}
