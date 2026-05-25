import { Routes } from '@angular/router';
import { MainLayout } from './shared/templates/main-layout/main-layout';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/auth/auth.routes').then(r => r.authRoutes),
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [],
  },
  { path: '**', redirectTo: 'login' },
];
