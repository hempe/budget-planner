import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigurationService } from '../../services/configuration';

export interface MenuGroup extends MenuEntry {
    entries: MenuEntry[];
}

export interface MenuEntry {
    readonly name?: string;
    readonly icon?: string;
    readonly action?: () => any;
}

@Component({
    selector: 'view-wrapper',
    templateUrl: 'view-wrapper.component.html',
    styleUrls: ['./view-wrapper.component.css']
})
export class ViewWrapperComponent implements OnInit {
    public get color() {
        return this.config.color;
    }
    constructor(private router: Router, private config: ConfigurationService) {}

    @Input() public button: MenuEntry;

    @Input() public head: MenuEntry;

    @Input() public groups: MenuGroup[];

    ngOnInit() {
        this.groups = [
            {
                entries: [
                    {
                        name: 'Home',
                        icon: 'home',
                        action: () => this.router.navigate(['/home'])
                    }
                ]
            },
            {
                name: 'User',
                entries: [
                    {
                        name: 'Budget',
                        icon: 'trending_up',
                        action: () => this.router.navigate(['budgets'])
                    },
                    {
                        name: 'Assets',
                        icon: 'attach_money',
                        action: () => this.router.navigate(['assets'])
                    },
                    {
                        name: 'Revenue',
                        icon: 'date_range',
                        action: () => this.router.navigate(['revenue'])
                    },
                    {
                        name: 'Development',
                        icon: 'insert_chart',
                        action: () => this.router.navigate(['development'])
                    },
                    {
                        name: 'Profile',
                        icon: 'person',
                        action: () => this.router.navigate(['profile'])
                    }
                ]
            }
        ];
    }

    public noAction() {}
}
