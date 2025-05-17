import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BanksComponent } from './pages/banks/banks.component';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: 'home', component: HomeComponent },
    { path: 'bancos', component: BanksComponent },
];
