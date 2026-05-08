import { Routes } from '@angular/router';
import { Countries } from './pages/countries/countries';
import { Country } from './pages/country/country';
import { Contact } from './pages/contact/contact';

export const routes: Routes = [
    { path: '', component: Countries },
    { path: 'country/:code', component: Country },
    { path: 'contact', component: Contact },
    { path: '**', redirectTo: '' }
];
