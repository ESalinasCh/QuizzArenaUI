import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
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
  QuizOrigin,
  QuizResponseAsExams,
  SaveMatchResponse,
  ExamResponse,
} from '../api/teacher-exam.contract';
import { buildApiUrl, buildHttpParams } from '../../../core/utils/api-url.util';
import { TEACHER_EXAM_ENDPOINTS, TEACHER_GRADES_ENDPOINTS } from '../api/teacher-exam.endpoints';
import { TEACHER_CLASSES_RESPONSE_MOCK } from '../mocks/teacher-exam.mock';
import { ClassSource, CreateExamRequest, Exam, Grade, Match, Question } from '../models/exam.model';
import { GradeAttemptFilters, GradeResponse, MatchResponse, MatchStatusResponse } from '../api/teacher-grades.contract';
import { mapGradeResponse, mapMatchResponse } from '../api/teacher-grades.mapper';
import { PagedRequest } from '../../../core/models/pagination.model';

export interface QuizPagedRequest extends PagedRequest {
  status?: string;
}export interface QuizAsExamRequest extends PagedRequest {
  origin?: QuizOrigin
}
export interface MatchFilters extends PagedRequest {
  code?: string;
  status?: MatchStatusResponse;
  mode?: string;
  courseId?: string;
  quizId?: string;
}


@Injectable({ providedIn: 'root' })
export class TeacherExamService {
  readonly #http = inject(HttpClient);

  getClasses(): Observable<ClassSource[]> {
    return of(TEACHER_CLASSES_RESPONSE_MOCK).pipe(
      map(classes => classes.map(mapClassSourceResponse)),
    );
  }

  getQuestions(processingJobsIds: string[]): Observable<Question[]> {
    const params = new HttpParams()
      .set('status', 'Verified')
      .set('pageSize', '100')
      .set('processingJobIds', processingJobsIds.join(';'));
    return this.#http
      .get<QuestionResponse[]>(buildApiUrl(TEACHER_EXAM_ENDPOINTS.questions), { params })
      .pipe(map(questions => questions.map(mapQuestionResponse)));
  }

  getExams(filters?: QuizPagedRequest): Observable<Exam[]> {
    const params = buildHttpParams(filters);
    return this.#http.get<ExamResponse[]>(buildApiUrl(TEACHER_EXAM_ENDPOINTS.exams), { params }).pipe(
      map(exams => exams.map(mapExamResponse))
    );
  }

  getQuizzesAsExams(
    request?: QuizAsExamRequest
  ): Observable<QuizResponseAsExams[]> {
    const params = buildHttpParams(request);
    return this.#http
      .get<QuizResponseAsExams[]>(
        buildApiUrl(TEACHER_EXAM_ENDPOINTS.exams), { params }
      )
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

  unpublishMatch(matchId: string): Observable<void> {
    return this.#http
      .post(buildApiUrl(TEACHER_EXAM_ENDPOINTS.unpublishMatch(matchId)), {})
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
      .pipe(catchError(() => of([])), map(grades => grades.map(mapGradeResponse)));
  }

  getMatches(filters: MatchFilters = {}): Observable<Match[]> {
    const params = buildHttpParams(filters);
    return this.#http
      .get<MatchResponse[]>(buildApiUrl(TEACHER_GRADES_ENDPOINTS.matches), { params })
      .pipe(catchError(() => of([])), map(matches => matches.map(mapMatchResponse)));
  }

  resetAttempts(id: string): Observable<void> {
    return this.#http
      .post(buildApiUrl(TEACHER_GRADES_ENDPOINTS.resetAttempts(id)), {})
      .pipe(catchError(() => of([])), map(() => void 0));
  }
}
