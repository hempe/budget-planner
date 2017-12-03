import { ActivatedRoute, Router } from '@angular/router';
import { Color, Colors } from 'ng2-charts';
import { Component, HostListener, OnInit } from '@angular/core';
import { Files, IAsset, IFile, IGroup, IUnit } from '../../common/file';
import { array, numberWithSeperator } from '../../common/helper';

import { ConfigurationService } from '../../services/configuration';
import { FileService } from '../../services/file-service';
import { Http } from '@angular/http';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';
import { MouseService } from '../../services/mouse';
import { TEST_JSON } from '../../common/testing/test';

@Component({
    selector: 'edit',
    templateUrl: 'edit.component.html',
    styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
    public head: MenuEntry = {};

    public units: IUnit<IAsset>[];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fileService: FileService,
        private config: ConfigurationService
    ) {}

    ngOnInit() {
        let type = this.route.snapshot.params['type'];
        let subType = this.route.snapshot.params['subtype'];
        this.fileService.current.assets.negativ;
        this.units = array(this.fileService.current[type][subType]);
        this.units.forEach(u => (u.elements = array(u.elements)));

        let path = `${type}.${subType}`;
        this.config.setColor(path);
        this.head = {
            icon: this.config.getIcon(path),
            name: this.config.getName(path),
            action: () => this.router.navigate(['/'])
        };
    }
}
