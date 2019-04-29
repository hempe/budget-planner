import {
    Component,
    ElementRef,
    OnInit,
    Renderer,
    ViewChild
} from '@angular/core';
import { Http, RequestOptions, ResponseContentType } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { map } from 'rxjs/operators/map';
import { makeid } from './common/helper';
import { ApiService } from './services/api';
import { ConfigurationService } from './services/configuration';
import { PdfRenderService } from './services/pdf-render';

declare var Chart: any;
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public loading = true;
    private iframeUrl = '/.auth/iframe';
    @ViewChild('iframe') public iframe: ElementRef;
    constructor(
        public configuraton: ConfigurationService,
        private http: Http,
        private router: Router,
        private route: ActivatedRoute,
        private api: ApiService,
        private renderer: Renderer,
        private pdfRender: PdfRenderService,
        private swUpdate: SwUpdate,
        public configuration: ConfigurationService
    ) {
        Chart.defaults.global.defaultFontFamily = 'roboto';

        this.api.init().then(x => {
            this.refreshIFrame();
            this.loading = false;
        });
    }

    @ViewChild('importFileInput') importFileInput: ElementRef;

    public download(type: string) {
        const options = new RequestOptions({
            responseType: ResponseContentType.Blob
        });

        if (type === 'pdf') {
            this.pdfRender.render('/api/export?format=html');
        } else {
            this.http
                .get(`/api/export?format=${type}`, options)
                .pipe(map(x => x.blob()))
                .subscribe(blob => {
                    console.info('Download complete');

                    this.saveData(`export.${type}`, blob);
                });
        }
    }

    public upload() {
        this.importFileInput.nativeElement.click();
    }

    public importFileInputChanged(fileInput: any) {
        if (fileInput.target.files && fileInput.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.http
                    .post(`/api/import`, JSON.parse(e.target.result))
                    .subscribe(r => {
                        this.router.navigated = false;
                        this.router.navigate(['./'], {
                            relativeTo: this.route
                        });
                    });
                this.importFileInput.nativeElement.value = null;
            };
            reader.readAsText(fileInput.target.files[0], 'utf-8');
        }
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
        }, 60 * 1000);
    }

    public signOut() {
        this.api.signOut();
    }

    public goHome() {
        this.router.navigate(['/']);
    }

    public gotoProfile() {
        this.router.navigate(['/profile']);
    }

    private saveData(fileName: string, blob: Blob): void {
        const a = <any>document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    public ngOnInit() {
        if (this.swUpdate.isEnabled) {
            this.swUpdate.available.subscribe(() => {
                if (confirm('New version available. Load New Version?')) {
                    window.location.reload();
                }
            });
        }
    }
}
