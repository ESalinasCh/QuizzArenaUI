import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { TeacherCreateExamPage } from './create-exam-page';

const MOCK_CLASSES = [
  { id: 'source-ddd-1', name: 'DDD - Semana 1' },
  { id: 'source-hex-1', name: 'Hexagonal - Semana 1' },
];

const MOCK_QUESTIONS = [
  { id: 'q1', text: '¿Qué es un Bounded Context?', options: [], sourceId: 'source-ddd-1', sourceName: 'DDD - Semana 1' },
  { id: 'q2', text: '¿Qué es un puerto?', options: [], sourceId: 'source-hex-1', sourceName: 'Hexagonal - Semana 1' },
];

describe('TeacherCreateExamPage', () => {
  let mockExamService: Partial<TeacherExamService>;

  beforeEach(() => {
    mockExamService = {
      getClasses: vi.fn().mockReturnValue(of(MOCK_CLASSES)),
      getQuestions: vi.fn().mockReturnValue(of(MOCK_QUESTIONS)),
      saveDraftExam: vi.fn().mockReturnValue(of({
        id: 'draft-1', title: 'Test', description: '', status: 'draft', questionIds: ['q1'], createdAt: '',
      })),
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: TeacherExamService, useValue: mockExamService },
        { provide: LOCALE_ID, useValue: 'en' },
      ],
    });
  });

  it('should start on step 1', () => {
    const fixture = TestBed.createComponent(TeacherCreateExamPage);
    fixture.detectChanges();
    expect(fixture.componentInstance.currentStep()).toBe(1);
  });

  it('should advance to step 2 on onInfoNext', () => {
    const fixture = TestBed.createComponent(TeacherCreateExamPage);
    fixture.detectChanges();
    fixture.componentInstance.onInfoNext({ title: 'Exam', description: 'Desc', classIds: ['source-ddd-1'] });
    expect(fixture.componentInstance.currentStep()).toBe(2);
  });

  it('should return empty filteredQuestions when no exam info set', () => {
    const fixture = TestBed.createComponent(TeacherCreateExamPage);
    fixture.detectChanges();
    expect(fixture.componentInstance.filteredQuestions()).toEqual([]);
  });

  it('should populate filteredQuestions with api response after onInfoNext', () => {
    const fixture = TestBed.createComponent(TeacherCreateExamPage);
    fixture.detectChanges();
    fixture.componentInstance.onInfoNext({ title: 'Exam', description: 'Desc', classIds: ['source-ddd-1'] });
    fixture.detectChanges();
    const filtered = fixture.componentInstance.filteredQuestions();
    expect(filtered.length).toBe(2);
    expect(mockExamService.getQuestions).toHaveBeenCalledWith(['source-ddd-1']);
  });

  it('should navigate to dashboard on goBack from step 1', () => {
    const fixture = TestBed.createComponent(TeacherCreateExamPage);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.componentInstance.goBack();
    expect(navigateSpy).toHaveBeenCalledWith(['/teacher/dashboard']);
  });

  it('should return to step 1 on goBack from step 2', () => {
    const fixture = TestBed.createComponent(TeacherCreateExamPage);
    fixture.detectChanges();
    fixture.componentInstance.onInfoNext({ title: 'T', description: 'D', classIds: [] });
    fixture.componentInstance.goBack();
    expect(fixture.componentInstance.currentStep()).toBe(1);
  });

  it('should navigate to publish on onQuestionsPublish', () => {
    const fixture = TestBed.createComponent(TeacherCreateExamPage);
    fixture.detectChanges();
    fixture.componentInstance.onInfoNext({ title: 'Exam', description: 'Desc', classIds: ['source-ddd-1'] });
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.componentInstance.onQuestionsPublish(new Set(['q1']));
    expect(navigateSpy).toHaveBeenCalledWith(['/teacher/exams/publish'], expect.objectContaining({
      state: expect.objectContaining({ quizId: 'draft-1', from: 'create' }),
    }));
  });

  it('should not navigate on onQuestionsPublish when exam info is null', () => {
    const fixture = TestBed.createComponent(TeacherCreateExamPage);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.componentInstance.onQuestionsPublish(new Set(['q1']));
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should call saveDraftExam and navigate to bank on onQuestionsSaveToBank', () => {
    const fixture = TestBed.createComponent(TeacherCreateExamPage);
    fixture.detectChanges();
    fixture.componentInstance.onInfoNext({ title: 'Exam', description: 'Desc', classIds: ['source-ddd-1'] });
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.componentInstance.onQuestionsSaveToBank(new Set(['q1']));
    expect(mockExamService.saveDraftExam).toHaveBeenCalledWith('Exam', 'Desc', ['q1']);
    expect(navigateSpy).toHaveBeenCalledWith(['/teacher/exams/bank']);
  });

  it('should not call saveDraftExam when exam info is null', () => {
    const fixture = TestBed.createComponent(TeacherCreateExamPage);
    fixture.detectChanges();
    fixture.componentInstance.onQuestionsSaveToBank(new Set(['q1']));
    expect(mockExamService.saveDraftExam).not.toHaveBeenCalled();
  });
});
