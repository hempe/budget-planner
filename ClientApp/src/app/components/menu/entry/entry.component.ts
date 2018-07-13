import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'menu-entry',
    templateUrl: 'entry.component.html',
    styleUrls: ['./entry.component.css']
})
export class MenuEntryComponent {
    @Input()
    @HostBinding('style.color')
    public color: string;
}
