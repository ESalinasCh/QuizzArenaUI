import { TestBed } from '@angular/core/testing';
import { RecentQuiz } from '../../models/student-quiz.model';
import { RecentQuizCard } from './recent-quiz-card';

describe('RecentQuizCard', () => {
  const quiz: RecentQuiz = { id: 'a1', title: 'Attempt 1', score: 80, completedAtLabel: '3 days ago', status: 'passed' };

  it('should render quiz title', () => {
    const fixture = TestBed.createComponent(RecentQuizCard);
    fixture.componentRef.setInput('quiz', quiz);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Attempt 1');
  });

  it('should emit viewResults on emitView', () => {
    const fixture = TestBed.createComponent(RecentQuizCard);
    fixture.componentRef.setInput('quiz', quiz);
    fixture.detectChanges();

    let emitted: string | undefined;
    fixture.componentInstance.viewResults.subscribe((id: string) => (emitted = id));

    fixture.componentInstance.emitView();
    expect(emitted).toBe('a1');
  });
});
