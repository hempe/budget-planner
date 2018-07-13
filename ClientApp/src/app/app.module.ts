import { CdkTableModule } from '@angular/cdk/table';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { ErrorStateMatcher, MatSnackBar } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterModule } from '@angular/router';
import {
    MissingTranslationHandler,
    TranslateLoader,
    TranslateModule,
    TranslateService
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import 'chartjs-plugin-deferred';
import { AceEditorModule } from 'ng2-ace-editor';
import { ChartsModule } from 'ng2-charts';
import { FileUploadModule } from 'ng2-file-upload';
import { AppComponent } from './app.component';
import { MaterialModule } from './app.material';
import { AppRoutes } from './app.router';
import { NumberWithSeperatorPipe } from './common/helper';
import { TableContentComponent } from './components/admin/table-content.component';
import { TableEntryComponent } from './components/admin/table-entry.component';
import { TableListComponent } from './components/admin/table-list.component';
import { BudgetListComponent } from './components/budget/budget-list.component';
import { BudgetComponent } from './components/budget/budget.component';
import { DashboardBarComponent } from './components/dashboard/bar/bar.component';
import { DashboardDoughnutComponent } from './components/dashboard/doughnut/doughnut.component';
import { DashboardIcon } from './components/dashboard/icon/icon.component';
import { DataSourceTableComponent } from './components/data-source-table/data-source-table.component';
import { DevelopmentComponent } from './components/development/development.component';
import { EditChartComponent } from './components/edit/chart/chart.component';
import { EditComponent } from './components/edit/edit.component';
import { ErrorComponent } from './components/error/error.component';
import { FieldComponent } from './components/field/field.component';
import { FlatFieldComponent } from './components/flat-field/flat-field.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MatFileComponent } from './components/matfile/matfile.component';
import { MenuModule } from './components/menu/menu.module';
import { OverviewChartComponent } from './components/overview/chart/chart.component';
import { OverviewComponent } from './components/overview/overview.component';
import { ProfileComponent } from './components/profile/profile.component';
import {
    ThemeSelector,
    ThemeSelectorDialog
} from './components/theme-selector/theme-selector.component';
import { ViewWrapperComponent } from './components/view-wrapper/view-wrapper.component';
import { DecimalFormatDirective } from './directives/decimal-format/decimal-format.directive';
import {
    FlexBreakDirective,
    FlexContainerDirective,
    FlexDirective
} from './directives/flex/flex.directive';
import { ReloadOnResizeDirective } from './directives/reload-onresize/reload-onresize.directive';
import { ApiService } from './services/api';
import { ConfigurationService } from './services/configuration';
import { CustomErrorStateMatcher } from './services/custom-error-state-matcher';
import { httpFactory } from './services/http-interceptor';
import { KeyboardService } from './services/keyboard';
import { MouseService } from './services/mouse';
import { PdfRenderService } from './services/pdf-render';
import { ResizeService } from './services/resize';
import { WarnMissingTranslationHandler } from './services/warn-missing-translation-handler';

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
        TableListComponent,
        TableContentComponent,
        TableEntryComponent,
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
        AceEditorModule,
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
