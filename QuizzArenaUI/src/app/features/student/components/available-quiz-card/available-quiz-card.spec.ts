import { TestBed } from '@angular/core/testing';
import { AvailableQuiz } from '../../models/student-quiz.model';
import { AvailableQuizCard } from './available-quiz-card';

describe('AvailableQuizCard', () => {
  const quiz: AvailableQuiz = {
    id: 'q1', title: 'Quiz 1', questionCount: 5, status: 'available',
    mode: 'Solo', duration: 15, attemptsAmount: 10, attemptsUsed: 2, hasActiveAttempt: false,
  };

  function renderCard(overrides: Partial<AvailableQuiz> = {}) {
    const fixture = TestBed.createComponent(AvailableQuizCard);
    fixture.componentRef.setInput('quiz', { ...quiz, ...overrides });
    fixture.detectChanges();

    return fixture;
  }

  function rowTexts(fixture: ReturnType<typeof renderCard>): string[] {
    return Array.from(fixture.nativeElement.querySelectorAll('dl > div')).map((row) => {
      const term = (row as HTMLElement).querySelector('dt')!.textContent!.trim();
      const definition = (row as HTMLElement).querySelector('dd')!.textContent!.trim();

      return `${term} ${definition}`;
    });
  }

  function metaItem(fixture: ReturnType<typeof renderCard>, label: string) {
    return fixture.componentInstance.metaItems().find((item) => item.label === label)!;
  }

  it('should render quiz title', () => {
    expect(renderCard().nativeElement.textContent).toContain('Quiz 1');
  });

  it('should emit startQuiz on emitStart', () => {
    const fixture = renderCard();

    let emitted: string | undefined;
    fixture.componentInstance.startQuiz.subscribe((id: string) => (emitted = id));

    fixture.componentInstance.emitStart();
    expect(emitted).toBe('q1');
  });

  it('should render question count, status and remaining attempts as labelled rows', () => {
    expect(rowTexts(renderCard({ mode: 'Exam' }))).toEqual([
      'Questions: 5',
      'Status: Available',
      'Attempts left: 8',
    ]);
  });

  it('should report an in progress status when the quiz has an active attempt', () => {
    expect(rowTexts(renderCard({ hasActiveAttempt: true }))).toContain('Status: In progress');
  });

  it('should report zero attempts left when every exam attempt was used', () => {
    expect(rowTexts(renderCard({ mode: 'Exam', attemptsUsed: 10 }))).toContain('Attempts left: 0');
  });

  it('should not report remaining attempts below zero', () => {
    expect(rowTexts(renderCard({ mode: 'Exam', attemptsUsed: 12 }))).toContain('Attempts left: 0');
  });

  it('should report unlimited attempts for solo quizzes', () => {
    expect(rowTexts(renderCard({ mode: 'Solo', attemptsUsed: 10 }))).toContain('Attempts left: ∞');
  });

  it('should report the remaining attempts for exams', () => {
    expect(rowTexts(renderCard({ mode: 'Exam', attemptsUsed: 7 }))).toContain('Attempts left: 3');
  });

  it('should report the remaining attempts for modes other than solo', () => {
    expect(rowTexts(renderCard({ mode: 'Multiple', attemptsUsed: 7 }))).toContain('Attempts left: 3');
  });

  it('should highlight an active attempt as a warning', () => {
    expect(metaItem(renderCard({ hasActiveAttempt: true }), 'Status').variant).toBe('warning');
  });

  it('should mark a quiz without an active attempt as successful', () => {
    expect(metaItem(renderCard(), 'Status').variant).toBe('success');
  });

  it('should mark unlimited attempts as successful', () => {
    expect(metaItem(renderCard({ mode: 'Solo', attemptsUsed: 10 }), 'Attempts left').variant).toBe(
      'success',
    );
  });

  it('should mark plenty of remaining exam attempts as successful', () => {
    expect(metaItem(renderCard({ mode: 'Exam', attemptsUsed: 7 }), 'Attempts left').variant).toBe(
      'success',
    );
  });

  it('should warn when a single exam attempt is left', () => {
    expect(metaItem(renderCard({ mode: 'Exam', attemptsUsed: 9 }), 'Attempts left').variant).toBe(
      'warning',
    );
  });

  it('should flag as danger when no exam attempt is left', () => {
    expect(metaItem(renderCard({ mode: 'Exam', attemptsUsed: 10 }), 'Attempts left').variant).toBe(
      'danger',
    );
  });

  it('should show the question count without a status variant', () => {
    expect(metaItem(renderCard(), 'Questions').variant).toBeUndefined();
  });
});
