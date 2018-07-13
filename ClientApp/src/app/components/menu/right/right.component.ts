import { Component, Input } from '@angular/core';

@Component({
    selector: 'menu-right',
    templateUrl: 'right.component.html',
    styleUrls: ['./right.component.css']
})
export class MenuRightComponent {
    private _noTop = false;
    @Input()
    public set noTop(value: boolean) {
        this._noTop = value == true || <any>value == 'true';
    }
    public get noTop(): boolean {
        return this._noTop;
    }
}
