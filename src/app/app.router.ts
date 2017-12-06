import { AppComponent } from './app.component';
import { BudgetsComponent } from './components/budgets/budgets.component';
import { EditComponent } from './components/edit/edit.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { Routes } from '@angular/router';

export const AppRoutes: Routes = [
    {
        path: 'profile',
        component: ProfileComponent,
        data: { state: 'profile' }
    },
    {
        path: 'budgets/:id',
        component: BudgetsComponent,
        data: { state: 'edit' }
    },
    {
        path: 'edit/:type/:subtype',
        component: EditComponent,
        data: { state: 'edit' }
    },
    {
        path: 'edit/:type/:id/:subtype',
        component: EditComponent,
        data: { state: 'edit' }
    },
    { path: '**', component: HomeComponent, data: { state: 'home' } }
];
