import { TestBed } from '@angular/core/testing';

import { QuizAccessForm } from './quiz-access-form';

describe('QuizAccessForm', () => {
  it('should emit submitQuizLink on submit', () => {
    const fixture = TestBed.createComponent(QuizAccessForm);
    fixture.detectChanges();

    let emitted: string | undefined;
    fixture.componentInstance.submitQuizLink.subscribe((link: string) => (emitted = link));

    fixture.componentInstance.submit('test-link');
    expect(emitted).toBe('test-link');
  });
});
