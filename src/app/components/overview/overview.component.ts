import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
    FrequencyValue,
    Group,
    OverviewValue,
    Profile
} from '../../common/file';
import { Observable, Subject } from 'rxjs';
import { array, clone, toNumber } from '../../common/helper';

import { ConfigurationService } from '../../services/configuration';
import { FileService } from '../../services/file-service';
import { Http } from '@angular/http';
import { MatPaginator } from '@angular/material';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';

@Component({
    selector: 'overview',
    templateUrl: 'overview.component.html',
    styleUrls: ['overview.component.css']
})
export class OverviewComponent implements OnInit {
    public head: MenuEntry = {};

    private value: OverviewValue;
    private type: string;
    private url: string;
    private name: string;
    private positiv: string;
    private negativ: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private config: ConfigurationService,
        private http: Http
    ) {}
    ngOnInit() {
        this.type = this.route.snapshot.data.type;

        this.head = {
            icon: 'arrow_back',
            name: this.config.getName(this.type),
            action: () =>
                this.router.navigate(['../'], { relativeTo: this.route })
        };

        this.name = this.config.getName(this.type);
        this.positiv = this.config.getName(`${this.type}.positiv`);
        this.negativ = this.config.getName(`${this.type}.negativ`);
        this.config.setColor(this.type);
        this.url = `/api/data/${this.type}`;
        this.getData().subscribe(x => (this.value = x));
    }

    public goto(path: string, tab: string) {
        this.router.navigate([this.type, path, { tab: tab }]);
    }

    private getData(): Observable<OverviewValue> {
        return this.http
            .get(this.url)
            .map(x => x.json())
            .map((x: OverviewValue) => x);
    }
}
