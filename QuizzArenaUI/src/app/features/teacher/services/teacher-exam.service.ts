import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { mapClassSourceResponse, mapExamResponse, mapQuestionResponse } from '../api/teacher-exam.mapper';
import {
  buildCreateExamResponseMock,
  TEACHER_CLASSES_RESPONSE_MOCK,
  TEACHER_EXAMS_MOCK,
  TEACHER_QUESTIONS_RESPONSE_MOCK,
} from '../mocks/teacher-exam.mock';
import { ClassSource, CreateExamRequest, Exam, Question } from '../models/exam.model';

@Injectable({ providedIn: 'root' })
export class TeacherExamService {
  getClasses(): Observable<ClassSource[]> {
    return of(TEACHER_CLASSES_RESPONSE_MOCK).pipe(
      map(classes => classes.map(mapClassSourceResponse)),
    );
  }

  getQuestions(): Observable<Question[]> {
    return of(TEACHER_QUESTIONS_RESPONSE_MOCK).pipe(
      map(questions => questions.map(mapQuestionResponse)),
    );
  }

  getExams(): Observable<Exam[]> {
    return of(TEACHER_EXAMS_MOCK).pipe(map(exams => exams.map(mapExamResponse)));
  }

  createExam(request: CreateExamRequest): Observable<Exam> {
    const response = buildCreateExamResponseMock(
      request.title,
      request.description,
      request.questionIds,
      'published',
    );
    return of(response).pipe(map(mapExamResponse));
  }

  saveDraftExam(title: string, description: string, questionIds: string[]): Observable<Exam> {
    const response = buildCreateExamResponseMock(title, description, questionIds, 'draft');
    return of(response).pipe(map(mapExamResponse));
  }
}
