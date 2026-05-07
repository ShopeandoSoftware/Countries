import { Routes } from '@angular/router';
import { Countries } from './pages/countries/countries';
import { Country } from './pages/country/country';

export const routes: Routes = [
    { path: '', component: Countries },
    { path: 'country/:code', component: Country },
    { path: '**', redirectTo: '' }
];
