import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { provideRouter, Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { ExamConfig } from '../../models/exam.model';
import { TeacherPublishExamPage } from './publish-exam-page';

const MOCK_CONFIG: ExamConfig = {
  durationMinutes: 30,
  maxRetries: 2,
  shuffleQuestions: false,
  shuffleOptions: false,
  enabledFrom: '2026-07-01T10:00',
  enabledUntil: '2026-07-31T10:00',
};

describe('TeacherPublishExamPage', () => {
  let mockExamService: Partial<TeacherExamService>;
  let location: Location;

  beforeEach(() => {
    mockExamService = {
      publishExam: vi.fn().mockReturnValue(of(void 0)),
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: TeacherExamService, useValue: mockExamService },
        { provide: LOCALE_ID, useValue: 'en' },
      ],
    });

    location = TestBed.inject(Location);
  });

  it('should call location.back on goBack when window history length is > 1', () => {
    vi.spyOn(window.history, 'length', 'get').mockReturnValue(2);
    const backSpy = vi.spyOn(location, 'back');
    const fixture = TestBed.createComponent(TeacherPublishExamPage);
    fixture.detectChanges();
    fixture.componentInstance.goBack();
    expect(backSpy).toHaveBeenCalled();
  });

  it('should call publishExam and goBack on onPublish when quizId is provided', () => {
    vi.spyOn(window.history, 'length', 'get').mockReturnValue(2);
    const backSpy = vi.spyOn(location, 'back');
    const fixture = TestBed.createComponent(TeacherPublishExamPage);
    fixture.componentRef.setInput('quizId', 'quiz-1');
    fixture.detectChanges();

    fixture.componentInstance.handlePublish(MOCK_CONFIG);
    expect(mockExamService.publishExam).toHaveBeenCalledWith('quiz-1', '', MOCK_CONFIG);
    expect(backSpy).toHaveBeenCalled();
  });

  it('should not call publishExam when quizId is missing', () => {
    const fixture = TestBed.createComponent(TeacherPublishExamPage);
    fixture.detectChanges();
    fixture.componentInstance.handlePublish(MOCK_CONFIG);
    expect(mockExamService.publishExam).not.toHaveBeenCalled();
  });
});
