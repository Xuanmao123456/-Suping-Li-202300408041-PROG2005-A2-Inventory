import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { 
    path: 'inventory', 
    loadComponent: () => import('./inventory-operation/inventory-operation.component').then(m => m.InventoryOperationComponent) 
  },
  { 
    path: 'search', 
    loadComponent: () => import('./search-filter/search-filter.component').then(m => m.SearchFilterComponent) 
  },
  { 
    path: 'privacy', 
    loadComponent: () => import('./privacy-security/privacy-security.component').then(m => m.PrivacySecurityComponent) 
  },
  { 
    path: 'help', 
    loadComponent: () => import('./help/help.component').then(m => m.HelpComponent) 
  },
  { path: '**', redirectTo: '/home' }
];