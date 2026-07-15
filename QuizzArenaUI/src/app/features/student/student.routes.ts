import { Routes } from '@angular/router';
import { attemptFlowGuard } from '../../core/guards/attempt-flow.guard';
import { StudentQuizListPage } from './pages/quiz-list-page/quiz-list-page';
import { StudentQuizQuestionPage } from './pages/quiz-question-page/quiz-question-page';
import { StudentQuizResultsPage } from './pages/quiz-results-page/quiz-results-page';
import { StudentQuizSessionPage } from './pages/quiz-session-page/quiz-session-page';
import { StudentExamListPage } from './pages/exam-list-page/exam-list-page';
import { StudentGradeHistoryPage } from './pages/grade-history-page/grade-history-page';
import { StudentExamSessionPage } from './pages/exam-session-page/exam-session-page';
import { StudentExamQuestionPage } from './pages/exam-question-page/exam-question-page';
import { StudentExamResultsPage } from './pages/exam-results-page/exam-results-page';

export const studentRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'quizzes' },
  { path: 'quizzes', component: StudentQuizListPage },
  {
    path: 'quizzes/:quizId/start',
    component: StudentQuizSessionPage,
    canDeactivate: [attemptFlowGuard],
    data: { immersive: true },
  },
  {
    path: 'quizzes/:quizId/questions',
    component: StudentQuizQuestionPage,
    canDeactivate: [attemptFlowGuard],
    data: { immersive: true },
  },
  { path: 'quizzes/:quizId/results', component: StudentQuizResultsPage },

  { path: 'exams', component: StudentExamListPage },
  {
    path: 'exams/:examId/start',
    component: StudentExamSessionPage,
    canDeactivate: [attemptFlowGuard],
    data: { immersive: true },
  },
  {
    path: 'exams/:examId/questions',
    component: StudentExamQuestionPage,
    canDeactivate: [attemptFlowGuard],
    data: { immersive: true },
  },
  { path: 'exams/:attemptId/results', component: StudentExamResultsPage },
  { path: 'grades', component: StudentGradeHistoryPage },
];
