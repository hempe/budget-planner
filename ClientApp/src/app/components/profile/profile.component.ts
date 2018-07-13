import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { Http } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile } from '../../common/api';
import { clone } from '../../common/helper';
import { Colors, ConfigurationService } from '../../services/configuration';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';
import { map } from 'rxjs/operators';

@Component({
    selector: 'profile',
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.css']
})
export class ProfileComponent implements OnInit {
    public uploadUrl = 'api/profile/upload';
    public value: Profile;
    public avatar: string;
    public languages: { name: string; value: string }[] = [
        { name: 'English', value: 'en' },
        { name: 'Deutsch', value: 'de' }
    ];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private http: Http,
        private config: ConfigurationService
    ) {
        this.config.resetColor();
        this.colors = Object.keys(Colors).map(x => {
            return {
                name: x,
                value: Colors[x]
            };
        });
    }

    public colors: { name: string; value: string }[];

    public head: MenuEntry = {
        icon: 'account_circle',
        name: 'Profile',
        action: () => {}
    };

    public get color(): string {
        return this.config.color;
    }

    public setCustomColor() {
        this.config.setCustomColor(this.value.color);
    }

    ngOnInit() {
        this.http
            .get('/api/profile')
            .pipe(map(x => x.json()))
            .subscribe(
                x => this.setValue(x, null),
                err => this.resetForm(null)
            );
        this.avatar = this.config.avatar;
    }

    public back(): void {
        this.router.navigate(['../'], { relativeTo: this.route });
    }

    public onSubmit(form: NgForm): void {
        this.http
            .post('/api/profile', this.value)
            .pipe(map(x => x.json()))
            .subscribe(
                x => this.setValue(x, form),
                err => this.resetForm(form)
            );
    }

    private setValue(x: any, form: NgForm) {
        this.config.profile = x;
        this.config.resetColor();
        this.value = clone(x);
        this.resetForm(form);
    }

    public reloadFiles() {
        this.http
            .get('/api/profile/image')
            .pipe(map(x => x.json()))
            .subscribe(uri => {
                this.config.avatar = uri ? uri.uri : undefined;

                this.avatar = this.config.avatar;
            });
    }

    private resetForm(form: NgForm) {
        if (form) {
            form.control.markAsUntouched();
            form.control.markAsPristine();
        }
    }
}
