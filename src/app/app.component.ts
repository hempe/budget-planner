import {} from 'chartjs-plugin-deferred/sr';
import 'rxjs/Rx';

import * as FileSaver from 'file-saver';

import { Component, ElementRef, ViewChild } from '@angular/core';
import { Http, RequestOptions, ResponseContentType } from '@angular/http';
import { array, makeid } from './common/helper';

import { ApiService } from './services/api';
import { ConfigurationService } from './services/configuration';
import { Profile } from './common/api';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

declare var Chart: any;
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    private iframeUrl = '/.auth/iframe';
    @ViewChild('iframe') public iframe: ElementRef;
    constructor(
        private configuraton: ConfigurationService,
        private http: Http,
        private router: Router,
        private api: ApiService,
        public configuration: ConfigurationService
    ) {
        Chart.defaults.global.defaultFontFamily = 'roboto';

        this.api.init().then(x => {
            this.refreshIFrame();
            this.loading = false;
        });
    }

    public download(type: string) {
        let options = new RequestOptions({
            responseType: ResponseContentType.Blob
        });

        this.http
            .get(`/api/data/export/${type}`, options)
            .map(x => x.blob())
            .subscribe(blob => {
                FileSaver.saveAs(blob, `export.${type}`);
            });
    }

    private refreshIFrame() {
        setInterval(() => {
            if (
                this.configuration.loggedIn &&
                this.iframe &&
                this.iframe.nativeElement
            ) {
                this.iframe.nativeElement.src = `${
                    this.iframeUrl
                }?q=${makeid()}`;
                console.debug('Refresh iframe', this.iframe.nativeElement.src);
            }
        }, 4 * 60 * 1000);
    }

    public loading: boolean = true;

    public signOut() {
        this.api.signOut();
    }

    public goHome() {
        this.router.navigate(['/']);
    }

    public gotoProfile() {
        this.router.navigate(['/profile']);
    }
}
