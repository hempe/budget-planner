import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'menu-container',
    templateUrl: 'container.component.html',
    styleUrls: ['./container.component.css']
})
export class MenuContainerComponent {
    private _noTop = false;
    @HostBinding('style.padding-top') paddingTop = '24px';
    @Input()
    public set noTop(value: boolean) {
        this._noTop = value === true || <any>value === 'true';
        this.paddingTop = this._noTop ? '0px' : '24px';
    }
    public get noTop(): boolean {
        return this._noTop;
    }
}
