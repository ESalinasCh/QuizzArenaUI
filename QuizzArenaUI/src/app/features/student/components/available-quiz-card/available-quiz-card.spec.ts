import { TestBed } from '@angular/core/testing';
import { AvailableQuiz } from '../../models/student-quiz.model';
import { AvailableQuizCard } from './available-quiz-card';

describe('AvailableQuizCard', () => {
  const quiz: AvailableQuiz = { id: 'q1', title: 'Quiz 1', questionCount: 5, status: 'available' };

  it('should render quiz title', () => {
    const fixture = TestBed.createComponent(AvailableQuizCard);
    fixture.componentRef.setInput('quiz', quiz);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Quiz 1');
  });

  it('should emit startQuiz on emitStart', () => {
    const fixture = TestBed.createComponent(AvailableQuizCard);
    fixture.componentRef.setInput('quiz', quiz);
    fixture.detectChanges();

    let emitted: string | undefined;
    fixture.componentInstance.startQuiz.subscribe((id: string) => (emitted = id));

    fixture.componentInstance.emitStart();
    expect(emitted).toBe('q1');
  });

  it('should display "New" status for new quiz', () => {
    const newQuiz: AvailableQuiz = { id: 'q2', title: 'Quiz 2', questionCount: 3, status: 'new' };
    const fixture = TestBed.createComponent(AvailableQuizCard);
    fixture.componentRef.setInput('quiz', newQuiz);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('New');
  });

  it('should display "Available" status for available quiz', () => {
    const fixture = TestBed.createComponent(AvailableQuizCard);
    fixture.componentRef.setInput('quiz', quiz);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Available');
  });
});
