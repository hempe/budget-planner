import 'chartjs-plugin-deferred';

import { ErrorStateMatcher, MatDialog, MatSnackBar } from '@angular/material';
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
import {
    ThemeSelector,
    ThemeSelectorDialog
} from './components/theme-selector/theme-selector.component';

import { ApiService } from './services/api';
import { AppComponent } from './app.component';
import { AppRoutes } from './app.router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { BudgetComponent } from './components/budget/budget.component';
import { BudgetListComponent } from './components/budget/budget-list.component';
import { CdkTableModule } from '@angular/cdk/table';
import { ChartsModule } from 'ng2-charts';
import { ConfigurationService } from './services/configuration';
import { CustomErrorStateMatcher } from './services/custom-error-state-matcher';
import { DashboardBarComponent } from './components/dashboard/bar/bar.component';
import { DashboardDoughnutComponent } from './components/dashboard/doughnut/doughnut.component';
import { DashboardIcon } from './components/dashboard/icon/icon.component';
import { DataSourceTableComponent } from './components/data-source-table/data-source-table.component';
import { DecimalFormatDirective } from './directives/decimal-format/decimal-format.directive';
import { DevelopmentComponent } from './components/development/development.component';
import { EditChartComponent } from './components/edit/chart/chart.component';
import { EditComponent } from './components/edit/edit.component';
import { ErrorComponent } from './components/error/error.component';
import { FieldComponent } from './components/field/field.component';
import { FileUploadModule } from 'ng2-file-upload';
import { FlatFieldComponent } from './components/flat-field/flat-field.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { KeyboardService } from './services/keyboard';
import { LoginComponent } from './components/login/login.component';
import { MatFileComponent } from './components/matfile/matfile.component';
import { MaterialModule } from './app.material';
import { MenuModule } from './components/menu/menu.module';
import { MouseService } from './services/mouse';
import { NgModule } from '@angular/core';
import { NumberWithSeperatorPipe } from './common/helper';
import { OverviewChartComponent } from './components/overview/chart/chart.component';
import { OverviewComponent } from './components/overview/overview.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ReloadOnResizeDirective } from './directives/reload-onresize/reload-onresize.directive';
import { ResizeService } from './services/resize';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ViewWrapperComponent } from './components/view-wrapper/view-wrapper.component';
import { WarnMissingTranslationHandler } from './services/warn-missing-translation-handler';
import { httpFactory } from './services/http-interceptor';
import { PdfRenderService } from './services/pdf-render';

@NgModule({
    declarations: [
        AppComponent,
        ViewWrapperComponent,
        FieldComponent,
        FlatFieldComponent,
        LoginComponent,
        HomeComponent,
        BudgetComponent,
        BudgetListComponent,
        EditComponent,
        EditChartComponent,
        ProfileComponent,
        DevelopmentComponent,
        ReloadOnResizeDirective,
        FlexContainerDirective,
        FlexDirective,
        FlexBreakDirective,
        DecimalFormatDirective,
        ErrorComponent,
        NumberWithSeperatorPipe,
        DataSourceTableComponent,
        DashboardDoughnutComponent,
        DashboardBarComponent,
        DashboardIcon,
        OverviewChartComponent,
        OverviewComponent,
        ThemeSelectorDialog,
        MatFileComponent
    ],
    entryComponents: [ThemeSelectorDialog, MatFileComponent],
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        BrowserAnimationsModule,
        MaterialModule,
        MenuModule,
        FileUploadModule,
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
        PdfRenderService,
        ResizeService,
        KeyboardService,
        ApiService,
        {
            provide: Http,
            useFactory: httpFactory,
            deps: [
                XHRBackend,
                RequestOptions,
                ConfigurationService,
                Router,
                MatSnackBar,
                TranslateService
            ]
        },
        ThemeSelector,
        { provide: ErrorStateMatcher, useClass: CustomErrorStateMatcher }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './api/i18n/', '');
}
