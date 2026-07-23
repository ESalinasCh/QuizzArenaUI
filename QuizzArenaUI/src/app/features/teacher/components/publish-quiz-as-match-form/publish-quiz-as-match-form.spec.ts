import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PublishQuizAsMatchForm } from './publish-quiz-as-match-form';
import { ExamConfig } from '../../models/exam.model';

describe('PublishQuizAsMatchForm', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: LOCALE_ID, useValue: 'en' }],
    });
  });

  it('should show duration error when value is out of range', () => {
    const fixture = TestBed.createComponent(PublishQuizAsMatchForm);
    fixture.detectChanges();

    fixture.componentInstance.matchModel.update(m => ({ ...m, durationMinutes: 0 }));
    fixture.componentInstance.submit();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Duration is required');
  });

  it('should show start date required error on empty submit', () => {
    const fixture = TestBed.createComponent(PublishQuizAsMatchForm);
    fixture.detectChanges();

    fixture.componentInstance.submit();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Start date is required');
  });

  it('should show date range error when end date is before start date', () => {
    const fixture = TestBed.createComponent(PublishQuizAsMatchForm);
    fixture.detectChanges();

    fixture.componentInstance.matchModel.set({
      courseId: 'c1',
      durationMinutes: 30,
      maxRetries: 1,
      enabledFrom: '2026-06-25T10:00',
      enabledUntil: '2026-06-24T10:00',
      shuffleQuestions: false,
      shuffleOptions: false,
    });
    fixture.componentInstance.submit();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('End date must be after start date');
  });

  it('should toggle shuffleQuestions independently', () => {
    const fixture = TestBed.createComponent(PublishQuizAsMatchForm);
    fixture.detectChanges();

    expect(fixture.componentInstance.matchModel().shuffleQuestions).toBe(false);
    fixture.componentInstance.toggleShuffleQuestions();
    expect(fixture.componentInstance.matchModel().shuffleQuestions).toBe(true);
    fixture.componentInstance.toggleShuffleQuestions();
    expect(fixture.componentInstance.matchModel().shuffleQuestions).toBe(false);
  });

  it('should toggle shuffleOptions independently', () => {
    const fixture = TestBed.createComponent(PublishQuizAsMatchForm);
    fixture.detectChanges();

    expect(fixture.componentInstance.matchModel().shuffleOptions).toBe(false);
    fixture.componentInstance.toggleShuffleOptions();
    expect(fixture.componentInstance.matchModel().shuffleOptions).toBe(true);
    fixture.componentInstance.toggleShuffleOptions();
    expect(fixture.componentInstance.matchModel().shuffleOptions).toBe(false);
  });

  it('should emit ExamConfig oonPublishlid submit', () => {
    const fixture = TestBed.createComponent(PublishQuizAsMatchForm);
    fixture.detectChanges();

    let emitted: ExamConfig | undefined;
    fixture.componentInstance.next.subscribe((config: ExamConfig) => (emitted = config));

    fixture.componentInstance.matchModel.set({
      courseId: 'c1',
      durationMinutes: 45,
      maxRetries: 2,
      enabledFrom: '2026-06-25T10:00',
      enabledUntil: '2026-06-26T10:00',
      shuffleQuestions: true,
      shuffleOptions: false,
    });
    fixture.componentInstance.submit();

    expect(emitted).toEqual({
      durationMinutes: 45,
      maxRetries: 2,
      shuffleQuestions: true,
      shuffleOptions: false,
      enabledFrom: '2026-06-25T10:00',
      enabledUntil: '2026-06-2onPublish:00',
    });
  });

  it('should not emit when form is invalid', () => {
    const fixture = TestBed.createComponent(PublishQuizAsMatchForm);
    fixture.detectChanges();

    let emitted = false;
    fixture.componentInstance.next.subscribe(() => (emitted = true));

    fixture.componentInstance.submit();
    expect(emitted).toBe(false);
  });
});
