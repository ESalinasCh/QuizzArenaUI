import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ExamStepConfig } from './exam-step-config';
import { ExamConfig } from '../../models/exam.model';

describe('ExamStepConfig', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: LOCALE_ID, useValue: 'en' }],
    });
  });

  it('should show duration error when value is out of range', () => {
    const fixture = TestBed.createComponent(ExamStepConfig);
    fixture.detectChanges();

    fixture.componentInstance.form.controls.durationMinutes.setValue(0);
    fixture.componentInstance.submit();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Duration must be at least 1 minute');
  });

  it('should show start date required error on empty submit', () => {
    const fixture = TestBed.createComponent(ExamStepConfig);
    fixture.detectChanges();

    fixture.componentInstance.submit();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Start date is required');
  });

  it('should show date range error when end date is before start date', () => {
    const fixture = TestBed.createComponent(ExamStepConfig);
    fixture.detectChanges();

    fixture.componentInstance.form.controls.durationMinutes.setValue(30);
    fixture.componentInstance.form.controls.maxRetries.setValue(1);
    fixture.componentInstance.form.controls.enabledFrom.setValue('2026-06-25T10:00');
    fixture.componentInstance.form.controls.enabledUntil.setValue('2026-06-24T10:00');
    fixture.componentInstance.submit();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('End date must be after start date');
  });

  it('should toggle shuffleQuestions independently', () => {
    const fixture = TestBed.createComponent(ExamStepConfig);
    fixture.detectChanges();

    expect(fixture.componentInstance.shuffleQuestions()).toBe(false);
    fixture.componentInstance.toggleShuffleQuestions();
    expect(fixture.componentInstance.shuffleQuestions()).toBe(true);
    fixture.componentInstance.toggleShuffleQuestions();
    expect(fixture.componentInstance.shuffleQuestions()).toBe(false);
  });

  it('should toggle shuffleOptions independently', () => {
    const fixture = TestBed.createComponent(ExamStepConfig);
    fixture.detectChanges();

    expect(fixture.componentInstance.shuffleOptions()).toBe(false);
    fixture.componentInstance.toggleShuffleOptions();
    expect(fixture.componentInstance.shuffleOptions()).toBe(true);
    fixture.componentInstance.toggleShuffleOptions();
    expect(fixture.componentInstance.shuffleOptions()).toBe(false);
  });

  it('should emit ExamConfig with both shuffle values on valid submit', () => {
    const fixture = TestBed.createComponent(ExamStepConfig);
    fixture.detectChanges();

    let emitted: ExamConfig | undefined;
    fixture.componentInstance.next.subscribe((config: ExamConfig) => (emitted = config));

    fixture.componentInstance.form.controls.durationMinutes.setValue(45);
    fixture.componentInstance.form.controls.maxRetries.setValue(2);
    fixture.componentInstance.form.controls.enabledFrom.setValue('2026-06-25T10:00');
    fixture.componentInstance.form.controls.enabledUntil.setValue('2026-06-26T10:00');
    fixture.componentInstance.toggleShuffleQuestions();
    fixture.componentInstance.submit();

    expect(emitted).toEqual({
      durationMinutes: 45,
      maxRetries: 2,
      shuffleQuestions: true,
      shuffleOptions: false,
      enabledFrom: '2026-06-25T10:00',
      enabledUntil: '2026-06-26T10:00',
    });
  });

  it('should not emit when form is invalid', () => {
    const fixture = TestBed.createComponent(ExamStepConfig);
    fixture.detectChanges();

    let emitted = false;
    fixture.componentInstance.next.subscribe(() => (emitted = true));

    fixture.componentInstance.submit();
    expect(emitted).toBe(false);
  });
});
