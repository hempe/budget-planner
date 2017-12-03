import { AppComponent } from './app.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';

export const AppRoutes: Routes = [
    { path: 'profile', component: ProfileComponent },
    { path: '**', component: HomeComponent }
];
