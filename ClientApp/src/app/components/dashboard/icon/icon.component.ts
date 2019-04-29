import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { isNullOrWhitespace } from '../../../common/helper';
import { ConfigurationService } from '../../../services/configuration';
import { DashboardConfig, Themes } from '../dashboard';

@Component({
    selector: 'dashboard-icon',
    templateUrl: 'icon.component.html',
    styleUrls: ['icon.component.css']
})
export class DashboardIconComponent implements OnInit {
    constructor(
        private http: Http,
        private router: Router,
        private configService: ConfigurationService
    ) {}

    @HostBinding('style.display') display = 'block';

    @Input()
    public config: DashboardConfig = {
        path: '',
        theme: Themes.light,
        type: 'icon'
    };

    public color = '';

    public get icon(): string {
        return this.config ? this.config.icon : '';
    }

    public get theme(): string {
        return this.config ? this.config.theme : '';
    }
    public get label(): string {
        return this.config ? this.config.path : '';
    }

    public ngOnInit(): void {
        this.color =
            this.config.theme === Themes.light
                ? '#fff'
                : this.configService.getColor(this.config.path);
    }

    public unpin() {
        const url = !isNullOrWhitespace(this.config.id)
            ? `api/dashboard/${this.config.path}/${this.config.id}`
            : `api/dashboard/${this.config.path}`;
        this.http.delete(url).subscribe(x => this.reload());
        this.display = 'none';
    }

    public onEdit() {
        this.router.navigate(['./', this.config.path]);
    }

    private reload() {
        this.router.navigated = false;
        this.router.navigate(['./']);
    }
}
