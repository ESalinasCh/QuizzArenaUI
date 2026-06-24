<<<<<<< HEAD
﻿import { Injectable } from '@angular/core';
=======
import { Injectable } from '@angular/core';
>>>>>>> 6a36d851 (feat(teacher): add exam creation flow)
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { mapClassSourceResponse, mapExamResponse, mapQuestionResponse } from '../api/teacher-exam.mapper';
import {
  buildCreateExamResponseMock,
  TEACHER_CLASSES_RESPONSE_MOCK,
<<<<<<< HEAD
  TEACHER_EXAMS_MOCK,
=======
>>>>>>> 6a36d851 (feat(teacher): add exam creation flow)
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

<<<<<<< HEAD
  getExams(): Observable<Exam[]> {
    return of(TEACHER_EXAMS_MOCK).pipe(map(exams => exams.map(mapExamResponse)));
  }

=======
>>>>>>> 6a36d851 (feat(teacher): add exam creation flow)
  createExam(request: CreateExamRequest): Observable<Exam> {
    const response = buildCreateExamResponseMock(
      request.title,
      request.description,
      request.questionIds,
<<<<<<< HEAD
      'published',
    );
    return of(response).pipe(map(mapExamResponse));
  }

  saveDraftExam(title: string, description: string, questionIds: string[]): Observable<Exam> {
    const response = buildCreateExamResponseMock(title, description, questionIds, 'draft');
    return of(response).pipe(map(mapExamResponse));
  }
=======
    );
    return of(response).pipe(map(mapExamResponse));
  }
>>>>>>> 6a36d851 (feat(teacher): add exam creation flow)
}
