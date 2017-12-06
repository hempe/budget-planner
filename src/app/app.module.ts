import {
    FlexBreakDirective,
    FlexContainerDirective,
    FlexDirective
} from './directives/flex/flex.directive';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
    MissingTranslationHandler,
    TranslateLoader,
    TranslateModule,
    TranslateService
} from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';

import { ApiService } from './services/api';
import { AppComponent } from './app.component';
import { AppRoutes } from './app.router';
import { BarComponent } from './components/bar/bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { BudgetsComponent } from './components/budgets/budgets.component';
import { CdkTableModule } from '@angular/cdk/table';
import { ChartsModule } from 'ng2-charts';
import { ConfigurationService } from './services/configuration';
import { CustomErrorStateMatcher } from './services/custom-error-state-matcher';
import { DataSourceTableComponent } from './components/data-source-table/data-source-table.component';
import { DoughnutComponent } from './components/doughnut/doughnut.component';
import { EditComponent } from './components/edit/edit.component';
import { ErrorComponent } from './components/error/error.component';
import { ErrorStateMatcher } from '@angular/material';
import { FieldComponent } from './components/field/field.component';
import { FileService } from './services/file-service';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { KeyboardService } from './services/keyboard';
import { LoginComponent } from './components/login/login.component';
import { MaterialModule } from './app.material';
import { MouseService } from './services/mouse';
import { NgModule } from '@angular/core';
import { NumberWithSeperatorPipe } from './common/helper';
import { ProfileComponent } from './components/profile/profile.component';
import { ReloadOnResizeDirective } from './directives/reload-onresize/reload-onresize.directive';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ViewWrapperComponent } from './components/view-wrapper/view-wrapper.component';
import { WarnMissingTranslationHandler } from './services/warn-missing-translation-handler';
import { httpFactory } from './services/http-interceptor';

@NgModule({
    declarations: [
        AppComponent,
        ViewWrapperComponent,
        FieldComponent,
        LoginComponent,
        HomeComponent,
        BudgetsComponent,
        EditComponent,
        DoughnutComponent,
        BarComponent,
        ProfileComponent,
        ReloadOnResizeDirective,
        FlexContainerDirective,
        FlexDirective,
        FlexBreakDirective,
        ErrorComponent,
        NumberWithSeperatorPipe,
        DataSourceTableComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        BrowserAnimationsModule,
        MaterialModule,
        CdkTableModule,
        ChartsModule,
        RouterModule.forRoot(
            AppRoutes,
            { enableTracing: true } // <-- debugging purposes only
        ),
        /** NGX Translate */
        HttpClientModule,
        TranslateModule.forRoot({
            missingTranslationHandler: {
                provide: MissingTranslationHandler,
                useClass: WarnMissingTranslationHandler
            },
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
        /*
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
        */
    ],
    providers: [
        ConfigurationService,
        MouseService,
        KeyboardService,
        ApiService,
        FileService,
        {
            provide: Http,
            useFactory: httpFactory,
            deps: [XHRBackend, RequestOptions, ConfigurationService, Router]
        }
        //{ provide: ErrorStateMatcher, useClass: CustomErrorStateMatcher }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
