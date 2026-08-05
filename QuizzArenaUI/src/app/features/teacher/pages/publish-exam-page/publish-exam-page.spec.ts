import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { CreateMatchRequestBody, UpdateMatchRequestBody } from '../../api/teacher-exam.contract';
import { TeacherPublishExamPage } from './publish-exam-page';
import { TeacherContentService } from '../../services/teacher-content.service';
import { NavigationHistoryService } from '../../../../core/services/navigation-history.service';
import { Match } from '../../models/exam.model';
import { Course } from '../../models/content-upload.model';

const MOCK_CREATE_REQUEST: CreateMatchRequestBody = {
  quizId: 'quiz-1',
  title: 'Quiz 1 Title',
  courseId: 'course-1',
  startedAt: '2026-07-01T10:00',
  finishedAt: '2026-07-31T10:00',
  timeMinutes: 30,
  attemptsAmount: 2,
  shuffleQuestion: false,
  shuffleOptions: false,
  questionsAmount: 10,
};

const MOCK_UPDATE_REQUEST: UpdateMatchRequestBody = {
  id: 'match-1',
  quizId: 'quiz-1',
  title: 'Quiz 1 Title',
  courseId: 'course-1',
  startedAt: '2026-07-01T10:00',
  finishedAt: '2026-07-31T10:00',
  timeMinutes: 45,
  attemptsAmount: 3,
  shuffleQuestion: true,
  shuffleOptions: true,
  questionsAmount: 15,
};

const MOCK_MATCH: Match = {
  id: 'match-1',
  quizId: 'quiz-1',
  title: 'Quiz 1 Match',
  courseName: 'Math 101',
  courseId: 'course-1',
  questionCount: 10,
  professorName: 'Prof. Smith',
  duration: 30,
  startedAt: '2026-07-01T10:00:00.000Z',
  finishedAt: '2026-07-31T10:00:00.000Z',
  attemptsAmount: 2,
  shuffleQuestion: false,
  shuffleOptions: false,
};

const MOCK_COURSES: Course[] = [
  { id: 'course-1', name: 'Math 101' },
  { id: 'course-2', name: 'Physics 201' },
];

describe('TeacherPublishExamPage', () => {
  let mockExamService: Partial<TeacherExamService>;
  let mockContentService: Partial<TeacherContentService>;
  let mockNavHistoryService: Partial<NavigationHistoryService>;

  beforeEach(() => {
    mockExamService = {
      saveMatch: vi.fn().mockReturnValue(of({ id: 'match-1' })),
      activateMatchAsActiveExam: vi.fn().mockReturnValue(of(void 0)),
      updateMatch: vi.fn().mockReturnValue(of(void 0)),
      getMatches: vi.fn().mockReturnValue(of([MOCK_MATCH])),
    };
    mockContentService = {
      getCourses: vi.fn().mockReturnValue(of(MOCK_COURSES)),
    };
    mockNavHistoryService = {
      back: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: TeacherExamService, useValue: mockExamService },
        { provide: TeacherContentService, useValue: mockContentService },
        { provide: NavigationHistoryService, useValue: mockNavHistoryService },
        { provide: LOCALE_ID, useValue: 'en' },
      ],
    });
  });

  it('should call navigationHistoryService.back on goBack', () => {
    const fixture = TestBed.createComponent(TeacherPublishExamPage);
    fixture.detectChanges();
    fixture.componentInstance.goBack();
    expect(mockNavHistoryService.back).toHaveBeenCalledWith('/teacher/exams/bank');
  });

  it('should call saveMatch, activateMatchAsActiveExam and goBack on handleSaveMatchRequest', () => {
    const fixture = TestBed.createComponent(TeacherPublishExamPage);
    fixture.componentRef.setInput('quizId', 'quiz-1');
    fixture.detectChanges();

    fixture.componentInstance.handleSaveMatchRequest(MOCK_CREATE_REQUEST);
    expect(mockExamService.saveMatch).toHaveBeenCalledWith(MOCK_CREATE_REQUEST);
    expect(mockExamService.activateMatchAsActiveExam).toHaveBeenCalledWith('match-1');
    expect(mockNavHistoryService.back).toHaveBeenCalledWith('/teacher/exams/bank');
  });

  it('should call updateMatch and goBack on handleUpdateMatchRequest', () => {
    const fixture = TestBed.createComponent(TeacherPublishExamPage);
    fixture.componentRef.setInput('quizId', 'quiz-1');
    fixture.componentRef.setInput('matchId', 'match-1');
    fixture.componentRef.setInput('mode', 'edit');
    fixture.detectChanges();

    fixture.componentInstance.handleUpdateMatchRequest(MOCK_UPDATE_REQUEST);
    expect(mockExamService.updateMatch).toHaveBeenCalledWith(MOCK_UPDATE_REQUEST);
    expect(mockNavHistoryService.back).toHaveBeenCalledWith('/teacher/exams/bank');
  });

  it('should fetch coursesResource from teacherContentService', async () => {
    const fixture = TestBed.createComponent(TeacherPublishExamPage);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(mockContentService.getCourses).toHaveBeenCalled();
    expect(fixture.componentInstance.coursesResource.value()).toEqual(MOCK_COURSES);
  });

  it('should fetch match for editMatchResource when mode is edit and matchId is set', async () => {
    const fixture = TestBed.createComponent(TeacherPublishExamPage);
    fixture.componentRef.setInput('quizId', 'quiz-1');
    fixture.componentRef.setInput('matchId', 'match-1');
    fixture.componentRef.setInput('mode', 'edit');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(mockExamService.getMatches).toHaveBeenCalledWith({ quizId: 'quiz-1' });
    expect(fixture.componentInstance.editMatchResource.value()).toEqual(MOCK_MATCH);
  });
});
