import { Component, ElementRef, ViewChild } from '@angular/core';
import { array, makeid } from './common/helper';

import { ApiService } from './services/api';
import { ConfigurationService } from './services/configuration';
import { FileService } from './services/file-service';
import { Profile } from './common/file';
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
        private router: Router,
        private fileService: FileService,
        private api: ApiService,
        public configuration: ConfigurationService
    ) {
        Chart.defaults.global.defaultFontFamily = 'roboto';

        this.api.init().then(x => {
            this.refreshIFrame();
            this.loading = false;
        });

        //fileService.loadMemory();
        if (!fileService.current) {
            fileService.current = {
                assets: {
                    name: 'Assets',
                    positiv: [
                        {
                            name: 'Example',
                            elements: [{ name: 'Example', value: 0 }]
                        }
                    ],
                    negativ: [
                        {
                            name: 'Example',
                            elements: [{ name: 'Example', value: 0 }]
                        }
                    ]
                },
                revenue: {
                    name: 'Revenue',
                    positiv: [
                        {
                            name: 'Example',
                            elements: [{ name: 'Example', value: 0 }]
                        }
                    ],
                    negativ: [
                        {
                            name: 'Example',
                            elements: [{ name: 'Example', value: 0 }]
                        }
                    ]
                },
                client: <Profile>{},
                name: 'Example',
                budgets: [
                    {
                        name: 'Budget',
                        positiv: [
                            {
                                name: 'Example',
                                elements: [{ name: 'Example', value: 0 }]
                            }
                        ],
                        negativ: [
                            {
                                name: 'Example',
                                elements: [{ name: 'Example', value: 0 }]
                            }
                        ]
                    }
                ],
                development: {
                    elements: [],
                    name: 'Development',
                    from: 2017,
                    to: 2018
                }
            };
        }

        fileService.current.budgets = array(fileService.current.budgets);
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
