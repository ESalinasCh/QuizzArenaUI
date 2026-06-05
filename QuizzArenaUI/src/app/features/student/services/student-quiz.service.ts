import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { STUDENT_QUIZ_DASHBOARD_MOCK, STUDENT_QUIZ_START_MOCKS } from '../mocks/student-quiz.mock';
import { StudentQuizDashboard, StudentQuizStart } from '../models/student-quiz.model';

@Injectable({ providedIn: 'root' })
export class StudentQuizService {
  getDashboard(): Observable<StudentQuizDashboard> {
    return of(STUDENT_QUIZ_DASHBOARD_MOCK);
  }

  getQuizStart(quizId: string): Observable<StudentQuizStart> {
    return of(STUDENT_QUIZ_START_MOCKS[quizId] ?? STUDENT_QUIZ_START_MOCKS['project-1-review']);
  }
}
