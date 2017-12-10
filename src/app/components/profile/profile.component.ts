import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ConfigurationService } from '../../services/configuration';
import { FileService } from '../../services/file-service';
import { Http } from '@angular/http';
import { IClient } from '../../common/file';
import { MatPaginator } from '@angular/material';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';
import { NgForm } from '@angular/forms/src/directives/ng_form';
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
        private config: ConfigurationService
    ) {
        this.config.resetColor();
    }

    ngOnInit() {
        this.http
            .get('/api/data/profile')
            .map(x => x.json())
            .subscribe(
                x => this.setValue(x, null),
                err => this.resetForm(null)
            );
    }

    public back(): void {
        this.router.navigate(['../'], { relativeTo: this.route });
    }

    public value: IClient;

    public onSubmit(form: NgForm): void {
        this.http
            .post('/api/data/profile', this.value)
            .map(x => x.json())
            .subscribe(
                x => this.setValue(x, form),
                err => this.resetForm(form)
            );
    }

    public head: MenuEntry = {
        icon: 'account_circle',
        name: 'Profile',
        action: () => {}
    };

    private setValue(x: any, form: NgForm) {
        this.value = clone(x);
        this.resetForm(form);
    }

    private resetForm(form: NgForm) {
        if (form) {
            form.control.markAsUntouched();
            form.control.markAsPristine();
        }
    }
}
