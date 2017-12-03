import { Color, Colors } from 'ng2-charts';
import { Component, HostListener } from '@angular/core';
import { Files, IFile } from '../../common/file';
import { array, numberWithSeperator } from '../../common/helper';

import { FileService } from '../../services/file-service';
import { Http } from '@angular/http';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';
import { MouseService } from '../../services/mouse';
import { TEST_JSON } from '../../common/testing/test';

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
    public active: any;
    constructor(
        private fileService: FileService,
        private mouseService: MouseService
    ) {
        this.assets = fileService.current.assets;
        this.revenue = fileService.current.revenue;
        //this.positiv = fileService.current.assets.positiv;
        //fileService.current.revenue.negativ
    }

    public edit(active: any) {
        this.active = active;
    }
}
