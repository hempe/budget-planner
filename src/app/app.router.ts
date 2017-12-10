import { AppComponent } from './app.component';
import { BudgetComponent } from './components/budget/budget.component';
import { BudgetListComponent } from './components/budget/budget-list.component';
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
        path: 'budgets',
        component: BudgetListComponent
    },
    {
        path: 'budgets/:id',
        component: BudgetComponent
    },
    {
        path: ':type/:subtype',
        component: EditComponent
    },
    {
        path: ':type/:id/:subtype',
        component: EditComponent
    },
    { path: '**', component: HomeComponent, data: { state: 'home' } }
];
