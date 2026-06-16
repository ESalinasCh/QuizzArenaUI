import { Routes } from '@angular/router';
import { TeacherDashboardPage } from './pages/dashboard-page/dashboard-page';
import { TeacherQuizManagementPage } from './pages/quiz-management-page/quiz-management-page';

export const teacherRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: TeacherDashboardPage },
  { path: 'quizzes', component: TeacherQuizManagementPage },
];
