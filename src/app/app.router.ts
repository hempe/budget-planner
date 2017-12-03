import { AppComponent } from './app.component';
import { EditComponent } from './components/edit/edit.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { Routes } from '@angular/router';

export const AppRoutes: Routes = [
    { path: 'profile', component: ProfileComponent },
    { path: 'edit/:type/:subtype', component: EditComponent },
    { path: '**', component: HomeComponent }
];
