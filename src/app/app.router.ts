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
        component: BudgetListComponent,
        data: { type: 'budgets' }
    },
    {
        path: 'budgets/:id',
        component: BudgetComponent,
        data: { type: 'budgets' }
    },
    {
        path: 'budgets/:id/positiv',
        component: EditComponent,
        data: { type: 'budgets', subType: 'positiv' }
    },
    {
        path: 'budgets/:id/negativ',
        component: EditComponent,
        data: { type: 'budgets', subType: 'negativ' }
    },
    {
        path: 'assets',
        component: OverviewComponent,
        data: { type: 'assets' }
    },
    {
        path: 'assets/positiv',
        component: EditComponent,
        data: { type: 'assets', subType: 'positiv' }
    },
    {
        path: 'assets/negativ',
        component: EditComponent,
        data: { type: 'assets', subType: 'negativ' }
    },
    {
        path: 'revenue',
        component: OverviewComponent,
        data: { type: 'revenue' }
    },
    {
        path: 'revenue/positiv',
        component: EditComponent,
        data: { type: 'revenue', subType: 'positiv' }
    },
    {
        path: 'revenue/negativ',
        component: EditComponent,
        data: { type: 'revenue', subType: 'negativ' }
    },
    { path: '**', component: HomeComponent }
];
