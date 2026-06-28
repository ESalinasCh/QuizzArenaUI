import { Routes } from '@angular/router';
import { TeacherDashboardPage } from './pages/dashboard-page/dashboard-page';
import { TeacherQuizManagementPage } from './pages/quiz-management-page/quiz-management-page';
import { TeacherUploadContentPage } from './pages/upload-content-page/upload-content-page';
import { TeacherCreateExamPage } from './pages/create-exam-page/create-exam-page';
import { TeacherPublishExamPage } from './pages/publish-exam-page/publish-exam-page';
import { TeacherExamBankPage } from './pages/exam-bank-page/exam-bank-page';

export const teacherRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: TeacherDashboardPage },
  { path: 'quizzes', component: TeacherQuizManagementPage },
  { path: 'content/upload', component: TeacherUploadContentPage },
  { path: 'exams/create', component: TeacherCreateExamPage },
  { path: 'exams/publish', component: TeacherPublishExamPage },
  { path: 'exams/bank', component: TeacherExamBankPage },
];
