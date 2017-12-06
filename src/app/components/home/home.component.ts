import { Color, Colors } from 'ng2-charts';
import { Component, HostListener } from '@angular/core';
import { Files, IFile } from '../../common/file';
import { array, numberWithSeperator } from '../../common/helper';

import { ConfigurationService } from '../../services/configuration';
import { FileService } from '../../services/file-service';
import { Http } from '@angular/http';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';
import { MouseService } from '../../services/mouse';
import { Router } from '@angular/router';

@Component({
    selector: 'home',
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    public head: MenuEntry = {
        icon: 'home',
        name: 'Home'
    };

    public assets: any;
    public revenue: any;
    public budget: any;

    constructor(
        private router: Router,
        private fileService: FileService,
        private config: ConfigurationService
    ) {
        this.assets = fileService.current.assets;
        this.revenue = fileService.current.revenue;
        this.budget = fileService.current.budgets;
        this.config.resetColor();
        //this.positiv = fileService.current.assets.positiv;
        //fileService.current.revenue.negativ
    }

    public budgets(id: number) {
        this.router.navigate(['budgets', id]);
    }
    public edit(path: any, tab: string) {
        let route = ['edit'].concat(path.split('.'));
        if (tab) route.push(<any>{ tab: tab });
        this.router.navigate(route);
    }
}
