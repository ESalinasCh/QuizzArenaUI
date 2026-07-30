import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { CreateMatchRequestBody } from '../../api/teacher-exam.contract';
import { TeacherPublishExamPage } from './publish-exam-page';
import { TeacherContentService } from '../../services/teacher-content.service';
import { NavigationHistoryService } from '../../../../core/services/navigation-history.service';

const MOCK_MATCH_REQUEST: CreateMatchRequestBody = {
  quizId: 'quiz-1',
  courseId: 'course-1',
  startedAt: '2026-07-01T10:00',
  finishedAt: '2026-07-31T10:00',
  timeMinutes: 30,
  attemptsAmount: 2,
  shuffleQuestion: false,
  shuffleOptions: false,
  questionsAmount: 0,
};

describe('TeacherPublishExamPage', () => {
  let mockExamService: Partial<TeacherExamService>;
  let mockContentService: Partial<TeacherContentService>;
  let mockNavHistoryService: Partial<NavigationHistoryService>;

  beforeEach(() => {
    mockExamService = {
      saveMatch: vi.fn().mockReturnValue(of({ id: 'match-1' })),
      activateMatchAsActiveExam: vi.fn().mockReturnValue(of(void 0)),
    };
    mockContentService = {
      getCourses: vi.fn().mockReturnValue(of([])),
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

  it('should call saveMatch, activateMatchAsActiveExam and goBack on handleMatchRequest', () => {
    const fixture = TestBed.createComponent(TeacherPublishExamPage);
    fixture.componentRef.setInput('quizId', 'quiz-1');
    fixture.detectChanges();

    fixture.componentInstance.handleMatchRequest(MOCK_MATCH_REQUEST);
    expect(mockExamService.saveMatch).toHaveBeenCalledWith(MOCK_MATCH_REQUEST);
    expect(mockExamService.activateMatchAsActiveExam).toHaveBeenCalledWith('match-1');
    expect(mockNavHistoryService.back).toHaveBeenCalledWith('/teacher/exams/bank');
  });
});
