import { TestBed } from '@angular/core/testing';
import { QuizCard } from './quiz-card';

describe('QuizCard', () => {
  it('should render title and action label', () => {
    const fixture = TestBed.createComponent(QuizCard);
    fixture.componentRef.setInput('title', 'Mathematics Quiz');
    fixture.componentRef.setInput('actionLabel', 'Start');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Mathematics Quiz');
    expect(fixture.nativeElement.textContent).toContain('Start');
  });

  it('should emit actionClick on button click', () => {
    const fixture = TestBed.createComponent(QuizCard);
    fixture.componentRef.setInput('title', 'Science Quiz');
    fixture.componentRef.setInput('actionLabel', 'Begin');
    fixture.detectChanges();

    let emitted = false;
    fixture.componentInstance.actionClick.subscribe(() => (emitted = true));

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(emitted).toBe(true);
  });

  it('should project ng-content', () => {
    const fixture = TestBed.createComponent(QuizCard);
    fixture.componentRef.setInput('title', 'History Quiz');
    fixture.componentRef.setInput('actionLabel', 'Play');
    fixture.detectChanges();

    const projectedContent = document.createTextNode('Projected meta');
    fixture.nativeElement.querySelector('div').appendChild(projectedContent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Projected meta');
  });

  it('should render title in an h3 element', () => {
    const fixture = TestBed.createComponent(QuizCard);
    fixture.componentRef.setInput('title', 'Geography Quiz');
    fixture.componentRef.setInput('actionLabel', 'Open');
    fixture.detectChanges();

    const h3 = fixture.nativeElement.querySelector('h3');
    expect(h3).toBeTruthy();
    expect(h3.textContent).toContain('Geography Quiz');
  });

  it('should update title and action label dynamically', () => {
    const fixture = TestBed.createComponent(QuizCard);
    fixture.componentRef.setInput('title', 'Initial Title');
    fixture.componentRef.setInput('actionLabel', 'Go');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Initial Title');

    fixture.componentRef.setInput('title', 'Updated Title');
    fixture.componentRef.setInput('actionLabel', 'Launch');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Updated Title');
    expect(fixture.nativeElement.textContent).toContain('Launch');
    expect(fixture.nativeElement.textContent).not.toContain('Initial Title');
  });
});
