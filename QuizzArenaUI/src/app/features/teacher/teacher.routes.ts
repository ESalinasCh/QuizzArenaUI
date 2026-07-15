import { Routes } from '@angular/router';
import { TeacherDashboardPage } from './pages/dashboard-page/dashboard-page';
import { TeacherQuizManagementPage } from './pages/quiz-management-page/quiz-management-page';
import { TeacherUploadContentPage } from './pages/upload-content-page/upload-content-page';
import { TeacherCreateExamPage } from './pages/create-exam-page/create-exam-page';
import { TeacherPublishExamPage } from './pages/publish-exam-page/publish-exam-page';
import { TeacherExamBankPage } from './pages/exam-bank-page/exam-bank-page';
import { TeacherGradePanelPage } from './pages/grade-panel-page/grade-panel-page';
import { TeacherProcessingJobPage } from './pages/processing-job-page/processing-job-page';
import { TeacherClassSourcesPage } from './pages/class-sources-page/class-sources-page';

export const teacherRoutes: Routes = [
  { path: 'dashboard', component: TeacherDashboardPage, pathMatch: 'full' },
  // { path: 'quizzes', component: TeacherQuizManagementPage },
  { path: 'content/upload', component: TeacherUploadContentPage, pathMatch: 'full' },
  { path: 'exams/create', component: TeacherCreateExamPage, pathMatch: 'full' },
  { path: 'exams/publish', component: TeacherPublishExamPage, pathMatch: 'full' },
  { path: 'exams/bank', component: TeacherExamBankPage },
  { path: 'grades', component: TeacherGradePanelPage },
  { path: 'jobs', component: TeacherProcessingJobPage },
  { path: 'class-sources', component: TeacherClassSourcesPage, pathMatch: 'full' },
  { path: 'class-sources/from-processing-job/:processing-job-id', component: TeacherQuizManagementPage, pathMatch: 'full' },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
];

