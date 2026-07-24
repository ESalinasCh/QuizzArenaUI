import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  mapClassSourceResponse,
  mapCreateQuizResponse,
  mapExamResponse,
  mapQuestionResponse,
} from '../api/teacher-exam.mapper';
import {
  CreateExamRequestBody,
  CreateMatchRequestBody,
  CreateQuizResponseBody,
  QuestionResponse,
  SaveMatchResponse,
} from '../api/teacher-exam.contract';
import { buildApiUrl } from '../../../core/utils/api-url.util';
import { TEACHER_EXAM_ENDPOINTS, TEACHER_GRADES_ENDPOINTS } from '../api/teacher-exam.endpoints';
import { TEACHER_CLASSES_RESPONSE_MOCK, TEACHER_EXAMS_MOCK } from '../mocks/teacher-exam.mock';
import { ClassSource, CreateExamRequest, Exam, ExamConfig, Grade, Match, Question } from '../models/exam.model';
import { GradeAttemptFilters, GradeResponse, MatchResponse } from '../api/teacher-grades.contract';
import { mapGradeResponse, mapMatchResponse } from '../api/teacher-grades.mapper';

@Injectable({ providedIn: 'root' })
export class TeacherExamService {
  readonly #http = inject(HttpClient);

  getClasses(): Observable<ClassSource[]> {
    return of(TEACHER_CLASSES_RESPONSE_MOCK).pipe(
      map(classes => classes.map(mapClassSourceResponse)),
    );
  }

  getQuestions(processingJobsIds: string[]): Observable<Question[]> {
    let params = new HttpParams()
      .set('status', 'Verified')
      .set('pageSize', '100');
    processingJobsIds.forEach(id => {
      params = params.append('processingJobsIds', id);
    });
    return this.#http
      .get<QuestionResponse[]>(buildApiUrl(TEACHER_EXAM_ENDPOINTS.questions), { params })
      .pipe(map(questions => questions.map(mapQuestionResponse)));
  }

  getExams(): Observable<Exam[]> {
    return of(TEACHER_EXAMS_MOCK).pipe(map(exams => exams.map(mapExamResponse)));
  }

  createExam(request: CreateExamRequest): Observable<Exam> {
    const quizBody: CreateExamRequestBody = {
      title: request.title,
      description: request.description,
      questionIds: request.questionIds,
    };
    return this.#http.post<CreateQuizResponseBody>(buildApiUrl(TEACHER_EXAM_ENDPOINTS.exams), quizBody).pipe(
      switchMap(quiz => {
        const matchBody: CreateMatchRequestBody = {
          quizId: quiz.id,
          courseId: request.classIds[0],
          questionsAmount: 8,
          startedAt: request.config.enabledFrom,
          finishedAt: request.config.enabledUntil,
          timeMinutes: request.config.durationMinutes,
          attemptsAmount: request.config.maxRetries,
          shuffleQuestion: request.config.shuffleQuestions,
          shuffleOptions: request.config.shuffleOptions,
        };
        return this.#http
          .post(buildApiUrl(TEACHER_EXAM_ENDPOINTS.matches), matchBody)
          .pipe(map(() => mapCreateQuizResponse(quiz)));
      }),
    );
  }

  saveDraftExam(title: string, description: string, questionIds: string[]): Observable<Exam> {
    const body: CreateExamRequestBody = { title, description, questionIds };
    return this.#http
      .post<CreateQuizResponseBody>(buildApiUrl(TEACHER_EXAM_ENDPOINTS.exams), body)
      .pipe(map(mapCreateQuizResponse));
  }

  activateMatchAsActiveExam(
    matchId: string
  ): Observable<void> {
    return this.#http
      .post(buildApiUrl(TEACHER_EXAM_ENDPOINTS.activeExams(matchId)), {})
      .pipe(map(() => void 0));
  }

  saveMatch(
    request: CreateMatchRequestBody
  ): Observable<SaveMatchResponse> {
    return this.#http
      .post<SaveMatchResponse>(buildApiUrl(TEACHER_EXAM_ENDPOINTS.matches), request);
  }

  getGrades(matchId?: string, filters: GradeAttemptFilters = {}): Observable<Grade[]> {
    return this.#http
      .get<GradeResponse[]>(buildApiUrl(TEACHER_GRADES_ENDPOINTS.grades(matchId || '')), {
        params: { ...filters },
      })
      .pipe(map(grades => grades.map(mapGradeResponse)));
  }

  getMatches(): Observable<Match[]> {
    return this.#http
      .get<MatchResponse[]>(buildApiUrl(TEACHER_GRADES_ENDPOINTS.matches))
      .pipe(map(matches => matches.map(mapMatchResponse)));
  }

  resetAttempts(id: string): Observable<void> {
    return this.#http
      .post(buildApiUrl(TEACHER_GRADES_ENDPOINTS.resetAttempts(id)), {})
      .pipe(map(() => void 0));
  }
}
