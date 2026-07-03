import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
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
} from '../api/teacher-exam.contract';
import { TEACHER_EXAM_ENDPOINTS } from '../api/teacher-exam.endpoints';
import { TEACHER_CLASSES_RESPONSE_MOCK, TEACHER_EXAMS_MOCK } from '../mocks/teacher-exam.mock';
import { ClassSource, CreateExamRequest, Exam, ExamConfig, Question } from '../models/exam.model';

@Injectable({ providedIn: 'root' })
export class TeacherExamService {
  readonly #http = inject(HttpClient);
  readonly #api = environment.apiBaseUrl;

  getClasses(): Observable<ClassSource[]> {
    return of(TEACHER_CLASSES_RESPONSE_MOCK).pipe(
      map(classes => classes.map(mapClassSourceResponse)),
    );
  }

  getQuestions(processingJobIds: string[]): Observable<Question[]> {
    let params = new HttpParams()
      .set('status', 'Verified')
      .set('pageSize', '100');
    processingJobIds.forEach(id => {
      params = params.append('processingJobIds', id);
    });
    return this.#http
      .get<QuestionResponse[]>(`${this.#api}${TEACHER_EXAM_ENDPOINTS.questions}`, { params })
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
    return this.#http.post<CreateQuizResponseBody>(`${this.#api}${TEACHER_EXAM_ENDPOINTS.exams}`, quizBody).pipe(
      switchMap(quiz => {
        const matchBody: CreateMatchRequestBody = {
          quizId: quiz.id,
          courseId: request.classIds[0],
          startedAt: request.config.enabledFrom,
          finishedAt: request.config.enabledUntil,
          timeMinutes: request.config.durationMinutes,
          attemptsAmount: request.config.maxRetries,
          shuffleQuestion: request.config.shuffleQuestions,
          shuffleOptions: request.config.shuffleOptions,
        };
        return this.#http
          .post(`${this.#api}${TEACHER_EXAM_ENDPOINTS.matches}`, matchBody)
          .pipe(map(() => mapCreateQuizResponse(quiz)));
      }),
    );
  }

  saveDraftExam(title: string, description: string, questionIds: string[]): Observable<Exam> {
    const body: CreateExamRequestBody = { title, description, questionIds };
    return this.#http
      .post<CreateQuizResponseBody>(`${this.#api}${TEACHER_EXAM_ENDPOINTS.exams}`, body)
      .pipe(map(mapCreateQuizResponse));
  }

  publishExam(quizId: string, courseId: string, config: ExamConfig): Observable<void> {
    const matchBody: CreateMatchRequestBody = {
      quizId,
      courseId,
      startedAt: config.enabledFrom,
      finishedAt: config.enabledUntil,
      timeMinutes: config.durationMinutes,
      attemptsAmount: config.maxRetries,
      shuffleQuestion: config.shuffleQuestions,
      shuffleOptions: config.shuffleOptions,
    };
    return this.#http
      .post(`${this.#api}${TEACHER_EXAM_ENDPOINTS.matches}`, matchBody)
      .pipe(map(() => void 0));
  }
}
