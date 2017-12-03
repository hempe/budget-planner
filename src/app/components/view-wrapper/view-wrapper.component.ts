import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

export interface MenuGroup extends MenuEntry {
    entries: MenuEntry[];
}

export interface MenuEntry {
    name?: string;
    icon?: string;
    action?: () => any;
}

@Component({
    selector: 'view-wrapper',
    templateUrl: 'view-wrapper.component.html',
    styleUrls: ['./view-wrapper.component.css']
})
export class ViewWrapperComponent implements OnInit {
    constructor(private router: Router) {}

    @Input() public button: MenuEntry;

    @Input() public head: MenuEntry;

    @Input() public groups: MenuGroup[];

    ngOnInit() {
        this.groups = [
            {
                entries: [
                    {
                        name: 'Login',
                        icon: 'exit_to_app',
                        action: () => this.router.navigate(['/login'])
                    }
                ]
            },
            {
                name: '',
                entries: [
                    {
                        name: 'Profile',
                        icon: 'person',
                        action: () => this.router.navigate(['profile'])
                    }
                ]
            }
        ];
    }

    public noAction() {
        alert('Not yet implemenet');
    }
}
