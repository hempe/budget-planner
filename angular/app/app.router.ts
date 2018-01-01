import { AppComponent } from './app.component';
import { BudgetComponent } from './components/budget/budget.component';
import { BudgetListComponent } from './components/budget/budget-list.component';
import { DevelopmentComponent } from './components/development/development.component';
import { EditComponent } from './components/edit/edit.component';
import { HomeComponent } from './components/home/home.component';
import { OverviewComponent } from './components/overview/overview.component';
import { ProfileComponent } from './components/profile/profile.component';
import { Routes } from '@angular/router';

export const AppRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    {
        path: 'profile',
        component: ProfileComponent
    },
    {
        path: 'development',
        component: DevelopmentComponent
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
        path: 'budgets/:id/positive',
        component: EditComponent,
        data: { type: 'budgets', subType: 'positive' }
    },
    {
        path: 'budgets/:id/negative',
        component: EditComponent,
        data: { type: 'budgets', subType: 'negative' }
    },
    {
        path: 'assets',
        component: OverviewComponent,
        data: { type: 'assets' }
    },
    {
        path: 'assets/positive',
        component: EditComponent,
        data: { type: 'assets', subType: 'positive' }
    },
    {
        path: 'assets/negative',
        component: EditComponent,
        data: { type: 'assets', subType: 'negative' }
    },
    {
        path: 'revenue',
        component: OverviewComponent,
        data: { type: 'revenue' }
    },
    {
        path: 'revenue/positive',
        component: EditComponent,
        data: { type: 'revenue', subType: 'positive' }
    },
    {
        path: 'revenue/negative',
        component: EditComponent,
        data: { type: 'revenue', subType: 'negative' }
    },
    { path: '**', component: HomeComponent }
];
