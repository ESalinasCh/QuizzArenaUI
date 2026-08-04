import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { PublishQuizAsMatchForm } from './publish-quiz-as-match-form';
import { CreateMatchRequestBody, UpdateMatchRequestBody } from '../../api/teacher-exam.contract';
import { Match } from '../../models/exam.model';

const MOCK_MATCH: Match = {
  id: 'match-123',
  quizId: 'quiz-456',
  title: 'Sample Match',
  courseName: 'Math 101',
  courseId: '10000000-0000-0000-0000-000000000001',
  questionCount: 15,
  professorName: 'Prof. Smith',
  duration: 45,
  startedAt: '2026-08-10T10:00:00.000Z',
  finishedAt: '2026-08-10T12:00:00.000Z',
  attemptsAmount: 3,
  shuffleQuestion: true,
  shuffleOptions: true,
};

describe('PublishQuizAsMatchForm', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: LOCALE_ID, useValue: 'en' }],
    });
  });

  it('should show duration error when value is out of range (< 1)', () => {
    const fixture = TestBed.createComponent(PublishQuizAsMatchForm);
    fixture.detectChanges();

    fixture.componentInstance.matchModel.update(m => ({ ...m, durationMinutes: '0' }));
    fixture.componentInstance.submit();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Duration must be at least 1 minute');
  });

  it('should show start date required error on empty submit', () => {
    const fixture = TestBed.createComponent(PublishQuizAsMatchForm);
    fixture.componentInstance.matchModel.update(m => ({ ...m, enabledFrom: '' }));
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
      durationMinutes: '30',
      questionsAmount: '10',
      maxRetries: '1',
      enabledFrom: '2026-10-25T10:00',
      enabledUntil: '2026-10-24T10:00',
      shuffleQuestions: false,
      shuffleOptions: false,
    });
    fixture.componentInstance.submit();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('End date must be after start date');
  });

  it('should show error when date is before or equal to current time', () => {
    const fixture = TestBed.createComponent(PublishQuizAsMatchForm);
    fixture.detectChanges();

    fixture.componentInstance.matchModel.set({
      courseId: 'c1',
      durationMinutes: '30',
      questionsAmount: '10',
      maxRetries: '1',
      enabledFrom: '2020-01-01T10:00',
      enabledUntil: '2020-01-02T10:00',
      shuffleQuestions: false,
      shuffleOptions: false,
    });
    fixture.componentInstance.submit();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Date must be greater than current date');
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

  it('should emit emitSaveRequest on valid submit in publish mode', () => {
    const fixture = TestBed.createComponent(PublishQuizAsMatchForm);
    fixture.componentRef.setInput('quizId', 'quiz-99');
    fixture.componentRef.setInput('mode', 'publish');
    fixture.detectChanges();

    let emitted: CreateMatchRequestBody | undefined;
    fixture.componentInstance.emitSaveRequest.subscribe((req: CreateMatchRequestBody) => (emitted = req));

    fixture.componentInstance.matchModel.set({
      courseId: '10000000-0000-0000-0000-000000000001',
      durationMinutes: '45',
      questionsAmount: '10',
      maxRetries: '2',
      enabledFrom: '2026-12-25T10:00',
      enabledUntil: '2026-12-26T10:00',
      shuffleQuestions: true,
      shuffleOptions: false,
    });
    fixture.componentInstance.submit();

    expect(emitted).toEqual({
      quizId: 'quiz-99',
      courseId: '10000000-0000-0000-0000-000000000001',
      questionsAmount: 10,
      startedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
      finishedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
      timeMinutes: 45,
      attemptsAmount: 2,
      shuffleQuestion: true,
      shuffleOptions: false,
    });
  });

  it('should pre-fill form and emit emitUpdateRequest on valid submit in edit mode', () => {
    const fixture = TestBed.createComponent(PublishQuizAsMatchForm);
    fixture.componentRef.setInput('mode', 'edit');
    fixture.componentRef.setInput('matchId', 'match-123');
    fixture.componentRef.setInput('quizId', 'quiz-456');
    fixture.componentRef.setInput('match', MOCK_MATCH);
    fixture.detectChanges();

    expect(fixture.componentInstance.matchModel().courseId).toBe('10000000-0000-0000-0000-000000000001');
    expect(fixture.componentInstance.matchModel().durationMinutes).toBe('45');
    expect(fixture.componentInstance.matchModel().questionsAmount).toBe('15');
    expect(fixture.componentInstance.matchModel().maxRetries).toBe('3');

    let emittedUpdate: UpdateMatchRequestBody | undefined;
    fixture.componentInstance.emitUpdateRequest.subscribe((req: UpdateMatchRequestBody) => (emittedUpdate = req));

    fixture.componentInstance.matchModel.update(m => ({
      ...m,
      enabledFrom: '2026-12-25T10:00',
      enabledUntil: '2026-12-26T10:00',
    }));

    fixture.componentInstance.submit();

    expect(emittedUpdate).toEqual({
      id: 'match-123',
      quizId: 'quiz-456',
      courseId: '10000000-0000-0000-0000-000000000001',
      questionsAmount: 15,
      startedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
      finishedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
      timeMinutes: 45,
      attemptsAmount: 3,
      shuffleQuestion: true,
      shuffleOptions: true,
    });
  });

  it('should emit back output when back button is triggered', () => {
    const fixture = TestBed.createComponent(PublishQuizAsMatchForm);
    fixture.detectChanges();

    let backEmitted = false;
    fixture.componentInstance.back.subscribe(() => (backEmitted = true));

    fixture.componentInstance.back.emit();
    expect(backEmitted).toBe(true);
  });

  it('should not emit when form is invalid', () => {
    const fixture = TestBed.createComponent(PublishQuizAsMatchForm);
    fixture.componentInstance.matchModel.update(m => ({ ...m, courseId: '' }));
    fixture.detectChanges();

    let emitted = false;
    fixture.componentInstance.emitSaveRequest.subscribe(() => (emitted = true));

    fixture.componentInstance.submit();
    expect(emitted).toBe(false);
  });
});
