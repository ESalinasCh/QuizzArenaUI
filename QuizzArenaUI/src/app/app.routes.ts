import { Routes } from '@angular/router';
import { MainLayout } from './shared/templates/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

