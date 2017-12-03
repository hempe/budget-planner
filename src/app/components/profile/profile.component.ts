import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

import { FileService } from '../../services/file-service';
import { Http } from '@angular/http';
import { IClient } from '../../common/file';
import { MatPaginator } from '@angular/material';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';
import { clone } from '../../common/helper';

@Component({
    selector: 'profile',
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.css']
})
export class ProfileComponent implements OnInit {
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private http: Http,
        private fileService: FileService
    ) {}

    public showForm = false;

    ngOnInit() {
        this.http
            .get('/api/data/profile')
            .map(x => x.json())
            .subscribe(x => this.setValue(x), err => this.resetForm());
    }

    public back(): void {
        this.router.navigate(['../'], { relativeTo: this.route });
    }

    public value: IClient;

    public submit(): void {
        this.showForm = false;
        this.http
            .post('/api/data/profile', this.value)
            .map(x => x.json())
            .subscribe(x => this.setValue(x), err => this.resetForm());
    }

    public head: MenuEntry = {
        icon: 'account_circle',
        name: 'Profile',
        action: () => {}
    };

    private setValue(x: any) {
        this.value = clone(x);
        this.resetForm();
    }

    private resetForm() {
        this.showForm = false;
        setTimeout(() => {
            this.showForm = true;
        }, 0);
    }
}
