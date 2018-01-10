import { Component, Input, HostBinding } from '@angular/core';
import { Http } from '@angular/http';
import { isNullOrWhitespace } from '../../../common/helper';
import { DashboardConfig, Themes } from '../dashboard';
import { Router } from '@angular/router';
import { ConfigurationService } from '../../../services/configuration';

@Component({
    selector: 'dashboard-icon',
    templateUrl: 'icon.component.html',
    styleUrls: ['icon.component.css']
})
export class DashboardIcon {
    constructor(
        private http: Http,
        private router: Router,
        private configService: ConfigurationService
    ) {}

    @HostBinding('style.display') display: string = 'block';

    @Input()
    public config: DashboardConfig = {
        path: '',
        theme: Themes.light,
        type: 'icon'
    };

    public color: string = '';

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
            this.config.theme == Themes.light
                ? '#fff'
                : this.configService.getColor(this.config.path);
    }

    public unpin() {
        let url = !isNullOrWhitespace(this.config.id)
            ? `api/data/dashboard/${this.config.path}/${this.config.id}`
            : `api/data/dashboard/${this.config.path}`;
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
