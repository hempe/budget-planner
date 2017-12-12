import { AppComponent } from './app.component';
import { BudgetComponent } from './components/budget/budget.component';
import { BudgetListComponent } from './components/budget/budget-list.component';
import { EditComponent } from './components/edit/edit.component';
import { HomeComponent } from './components/home/home.component';
import { OverviewComponent } from './components/overview/overview.component';
import { ProfileComponent } from './components/profile/profile.component';
import { Routes } from '@angular/router';

export const AppRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    {
        path: 'profile',
        component: ProfileComponent,
        data: { state: 'profile' }
    },
    {
        path: 'budgets',
        component: BudgetListComponent
    },
    {
        path: 'budgets/:id',
        component: BudgetComponent
    },
    {
        path: ':type',
        component: OverviewComponent
    },
    {
        path: ':type/:subtype',
        component: EditComponent
    },
    {
        path: ':type/:id/:subtype',
        component: EditComponent
    },
    { path: '**', component: HomeComponent }
];
