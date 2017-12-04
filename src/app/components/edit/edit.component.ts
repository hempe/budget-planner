import { ActivatedRoute, Router } from '@angular/router';
import { Color, Colors } from 'ng2-charts';
import { Component, HostListener, OnInit } from '@angular/core';
import {
    DataSourceDefinition,
    DataSourceValue,
    ListDataSource
} from '../../services/data-source-wrapper';
import { Files, IAsset, IFile, IGroup, IUnit } from '../../common/file';
import { array, numberWithSeperator } from '../../common/helper';

import { ConfigurationService } from '../../services/configuration';
import { DataSource } from '@angular/cdk/table';
import { FileService } from '../../services/file-service';
import { Http } from '@angular/http';
import { MatPaginator } from '@angular/material';
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
    public type: string;
    public subType: string;

    public dataSources: DataSourceDefinition<IUnit<IAsset>[], IAsset>[];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fileService: FileService,
        private config: ConfigurationService
    ) {}

    ngOnInit() {
        this.type = this.route.snapshot.params['type'];
        this.subType = this.route.snapshot.params['subtype'];
        this.fileService.current.assets.negativ;
        this.units = array(this.fileService.current[this.type][this.subType]);
        this.units.forEach(u => (u.elements = array(u.elements)));

        let query = (
            units: IUnit<IAsset>[],
            paginator: MatPaginator,
            page?: number,
            query?: any
        ) => {
            return <DataSourceValue<IAsset>>{};
        };

        this.dataSources = this.units.map(unit => {
            return <DataSourceDefinition<IUnit<IAsset>[], IAsset>>{
                name: unit.name,
                columns: [
                    { key: 'name', name: 'Name' },
                    { key: 'value', name: 'Value' },
                    { key: 'year', name: 'Year' }
                ],
                createDataSource: (p, f, c) =>
                    new ListDataSource(
                        [].concat.apply([], unit.elements),
                        p,
                        f,
                        c
                    )
            };
        });

        let path = `${this.type}.${this.subType}`;
        this.config.setColor(path);
        this.head = {
            icon: this.config.getIcon(path),
            name: this.config.getName(path),
            action: () => this.router.navigate(['/'])
        };
    }
}
