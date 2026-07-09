import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
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
  });

  it('should navigate to /teacher/exams/create on goBack when from is create', () => {
    history.replaceState({ from: 'create', title: 'T', description: '', classIds: [], questionIds: [] }, '');
    const fixture = TestBed.createComponent(TeacherPublishExamPage);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.componentInstance.goBack();
    expect(navigateSpy).toHaveBeenCalledWith(['/teacher/exams/create']);
  });

  it('should navigate to /teacher/exams/bank on goBack when from is bank', () => {
    history.replaceState({ from: 'bank', title: 'T', description: '', classIds: [], questionIds: [] }, '');
    const fixture = TestBed.createComponent(TeacherPublishExamPage);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.componentInstance.goBack();
    expect(navigateSpy).toHaveBeenCalledWith(['/teacher/exams/bank']);
  });

  it('should navigate to /teacher/dashboard on goBack when from is dashboard', () => {
    history.replaceState({ from: 'dashboard', title: 'T', description: '', classIds: [], questionIds: [] }, '');
    const fixture = TestBed.createComponent(TeacherPublishExamPage);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.componentInstance.goBack();
    expect(navigateSpy).toHaveBeenCalledWith(['/teacher/dashboard']);
  });

  it('should call publishExam and navigate to dashboard on onPublish', () => {
    history.replaceState({ from: 'create', quizId: 'quiz-1', classIds: ['c1'] }, '');
    const fixture = TestBed.createComponent(TeacherPublishExamPage);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.componentInstance.onPublish(MOCK_CONFIG);
    expect(mockExamService.publishExam).toHaveBeenCalledWith('quiz-1', 'c1', MOCK_CONFIG);
    expect(navigateSpy).toHaveBeenCalledWith(['/teacher/dashboard']);
  });

  it('should not call publishExam when history state has no quizId', () => {
    history.replaceState({}, '');
    const fixture = TestBed.createComponent(TeacherPublishExamPage);
    fixture.detectChanges();
    fixture.componentInstance.onPublish(MOCK_CONFIG);
    expect(mockExamService.publishExam).not.toHaveBeenCalled();
  });
});
