import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OverviewValue } from '../../common/api';
import { ConfigurationService } from '../../services/configuration';
import { DashboardConfig } from '../dashboard/dashboard';
import { ThemeSelector } from '../theme-selector/theme-selector.component';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';

@Component({
    selector: 'overview',
    templateUrl: 'overview.component.html',
    styleUrls: ['overview.component.css']
})
export class OverviewComponent implements OnInit {
    public head: MenuEntry = {};
    public theme: string = undefined;
    public value: OverviewValue;
    public name: string;
    public positive: string;
    public negative: string;

    private type: string;
    private url: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private config: ConfigurationService,
        private http: Http,
        private themeSelector: ThemeSelector
    ) {}
    ngOnInit() {
        this.type = this.route.snapshot.data.type;

        this.head = {
            icon: 'arrow_back',
            name: this.config.getName(this.type),
            action: () =>
                this.router.navigate(['../'], { relativeTo: this.route })
        };

        this.http
            .get(`/api/dashboard/${this.type}`)
            .pipe(map(x => x.json()))
            .subscribe(x => (this.theme = x.theme));

        this.name = this.config.getTranslatedName(this.type);
        this.positive = this.config.getTranslatedName(`${this.type}.positive`);
        this.negative = this.config.getTranslatedName(`${this.type}.negative`);
        this.config.setColor(this.type);
        this.url = `/api/${this.type}`;
        this.getData().subscribe(x => (this.value = x));
    }

    public goto(path: string, tab: string) {
        this.router.navigate([this.type, path, { tab: tab }]);
    }

    public pin() {
        if (this.theme) {
            this.http
                .delete(`/api/dashboard/${this.type}`)
                .subscribe(x => (this.theme = undefined));
        } else {
            this.themeSelector.selectTheme().subscribe(theme => {
                this.http
                    .post('/api/dashboard', <DashboardConfig>{
                        path: this.type,
                        theme: theme,
                        type: 'bar'
                    })
                    .pipe(map(x => x.json()))
                    .subscribe(x => (this.theme = x.theme));
            });
        }
    }

    private getData(): Observable<OverviewValue> {
        return this.http.get(this.url).pipe(map(x => x.json()));
    }
}
