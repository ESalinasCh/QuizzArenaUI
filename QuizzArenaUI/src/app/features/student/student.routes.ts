import { Routes } from '@angular/router';
import { StudentQuizListPage } from './pages/quiz-list-page/quiz-list-page';
import { StudentQuizQuestionPage } from './pages/quiz-question-page/quiz-question-page';
import { StudentQuizResultsPage } from './pages/quiz-results-page/quiz-results-page';
import { StudentQuizSessionPage } from './pages/quiz-session-page/quiz-session-page';

export const studentRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'quizzes' },
  { path: 'quizzes', component: StudentQuizListPage },
  { path: 'quizzes/:quizId/start', component: StudentQuizSessionPage, data: { immersive: true } },
  {
    path: 'quizzes/:quizId/questions',
    component: StudentQuizQuestionPage,
    data: { immersive: true },
  },
  { path: 'quizzes/:quizId/results', component: StudentQuizResultsPage },
];
