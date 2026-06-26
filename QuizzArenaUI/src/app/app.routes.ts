import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { MainLayout } from './shared/templates/main-layout/main-layout';
import { LoginPage } from './features/auth/pages/login-page/login-page';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: () => inject(AuthService).getDefaultRoute(),
      },
      {
        path: 'student',
        canActivate: [roleGuard],
        data: { roles: ['student'] },
        loadChildren: () =>
          import('./features/student/student.routes').then((m) => m.studentRoutes),
      },
      {
        path: 'teacher',
        canActivate: [roleGuard],
        data: { roles: ['teacher'] },
        loadChildren: () =>
          import('./features/teacher/teacher.routes').then((m) => m.teacherRoutes),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
