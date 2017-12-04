import { ApiService } from './services/api';
import { Component } from '@angular/core';
import { ConfigurationService } from './services/configuration';
import { FileService } from './services/file-service';
import { Router } from '@angular/router';
import { TEST_JSON } from './common/testing/test';
import { TranslateService } from '@ngx-translate/core';
import { array } from './common/helper';
declare var Chart: any;
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(
        private configuraton: ConfigurationService,
        private router: Router,
        private fileService: FileService,
        private api: ApiService,
        public configuration: ConfigurationService
    ) {
        Chart.defaults.global.defaultFontFamily = 'roboto';

        this.api.init().then(x => (this.loading = false));

        //fileService.loadMemory();
        //if (!fileService.current) {
        fileService.loadFile({
            name: 'myfile.pbj',
            data: JSON.stringify(TEST_JSON)
        });
        //}

        fileService.current.budgets = array(fileService.current.budgets);
        fileService.current.budgets.pop();
        fileService.current.budgets.pop();
        fileService.current.budgets.pop();
        fileService.current.budgets.pop();
        fileService.current.budgets.pop();
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
