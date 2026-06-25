import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ExamStepQuestions } from './exam-step-questions';
import { Question } from '../../models/exam.model';

const MOCK_QUESTIONS: Question[] = [
  { id: 'q1', text: 'What is DDD?', options: ['A', 'B', 'C', 'D'], sourceId: 'cls-1', sourceName: 'Class 1' },
  { id: 'q2', text: 'What is a Bounded Context?', options: ['A', 'B', 'C', 'D'], sourceId: 'cls-1', sourceName: 'Class 1' },
];

describe('ExamStepQuestions', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: LOCALE_ID, useValue: 'en' }],
    });
  });

  it('should render question texts', () => {
    const fixture = TestBed.createComponent(ExamStepQuestions);
    fixture.componentRef.setInput('questions', MOCK_QUESTIONS);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('What is DDD?');
    expect(fixture.nativeElement.textContent).toContain('What is a Bounded Context?');
  });

  it('should toggle question selection', () => {
    const fixture = TestBed.createComponent(ExamStepQuestions);
    fixture.componentRef.setInput('questions', MOCK_QUESTIONS);
    fixture.detectChanges();

    expect(fixture.componentInstance.isSelected('q1')).toBe(false);
    fixture.componentInstance.toggleQuestion('q1');
    expect(fixture.componentInstance.isSelected('q1')).toBe(true);
    fixture.componentInstance.toggleQuestion('q1');
    expect(fixture.componentInstance.isSelected('q1')).toBe(false);
  });

  it('should remove question from visible list', () => {
    const fixture = TestBed.createComponent(ExamStepQuestions);
    fixture.componentRef.setInput('questions', MOCK_QUESTIONS);
    fixture.detectChanges();

    expect(fixture.componentInstance.visibleQuestions().length).toBe(2);
    fixture.componentInstance.removeQuestion('q1');
    expect(fixture.componentInstance.visibleQuestions().length).toBe(1);
    expect(fixture.componentInstance.visibleQuestions()[0].id).toBe('q2');
  });

  it('should deselect question when it is removed', () => {
    const fixture = TestBed.createComponent(ExamStepQuestions);
    fixture.componentRef.setInput('questions', MOCK_QUESTIONS);
    fixture.detectChanges();

    fixture.componentInstance.toggleQuestion('q1');
    expect(fixture.componentInstance.isSelected('q1')).toBe(true);

    fixture.componentInstance.removeQuestion('q1');
    expect(fixture.componentInstance.isSelected('q1')).toBe(false);
  });

  it('should not emit when no question is selected', () => {
    const fixture = TestBed.createComponent(ExamStepQuestions);
    fixture.componentRef.setInput('questions', MOCK_QUESTIONS);
    fixture.detectChanges();

    let emitted = false;
    fixture.componentInstance.next.subscribe(() => (emitted = true));

    fixture.componentInstance.submit();
    expect(emitted).toBe(false);
  });

  it('should emit selected question IDs on submit', () => {
    const fixture = TestBed.createComponent(ExamStepQuestions);
    fixture.componentRef.setInput('questions', MOCK_QUESTIONS);
    fixture.detectChanges();

    let emitted: Set<string> | undefined;
    fixture.componentInstance.next.subscribe((ids: Set<string>) => (emitted = ids));

    fixture.componentInstance.toggleQuestion('q1');
    fixture.componentInstance.submit();

    expect(emitted?.has('q1')).toBe(true);
    expect(emitted?.has('q2')).toBe(false);
  });

  it('canContinue should be false with no selection and true after selecting', () => {
    const fixture = TestBed.createComponent(ExamStepQuestions);
    fixture.componentRef.setInput('questions', MOCK_QUESTIONS);
    fixture.detectChanges();

    expect(fixture.componentInstance.canContinue()).toBe(false);
    fixture.componentInstance.toggleQuestion('q2');
    expect(fixture.componentInstance.canContinue()).toBe(true);
  });
});
