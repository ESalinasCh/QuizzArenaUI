import { Routes } from '@angular/router';
import { MainLayout } from './shared/templates/main-layout/main-layout';
import { LoginPage } from './features/auth/pages/login-page/login-page';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [],
  },
  { path: '**', redirectTo: '' },
];
