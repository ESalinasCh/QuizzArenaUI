import { TestBed } from '@angular/core/testing';
import { RecentQuizMeta } from './recent-quiz-meta';

describe('RecentQuizMeta', () => {
  it('should render the score percentage', () => {
    const fixture = TestBed.createComponent(RecentQuizMeta);
    fixture.componentRef.setInput('score', 85);
    fixture.componentRef.setInput('completedAtLabel', '2 hours ago');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('85%');
  });

  it('should render the completed at label', () => {
    const fixture = TestBed.createComponent(RecentQuizMeta);
    fixture.componentRef.setInput('score', 60);
    fixture.componentRef.setInput('completedAtLabel', 'Yesterday');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Yesterday');
  });

  it('should apply warning styles by default for scores below the passing threshold', () => {
    const fixture = TestBed.createComponent(RecentQuizMeta);
    fixture.componentRef.setInput('score', 50);
    fixture.componentRef.setInput('completedAtLabel', '1 day ago');
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('qz-icon');
    const paragraph = fixture.nativeElement.querySelector('p');

    expect(icon).toBeTruthy();
    expect(paragraph?.classList.contains('text-warning-text-light')).toBe(true);
  });

  it('should show the check icon when status is completed', () => {
    const fixture = TestBed.createComponent(RecentQuizMeta);
    fixture.componentRef.setInput('score', 95);
    fixture.componentRef.setInput('completedAtLabel', 'Just now');
    fixture.componentRef.setInput('status', 'completed');
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('qz-icon');

    expect(icon).toBeTruthy();
  });

  it('should apply success styles for scores above the passing threshold', () => {
    const fixture = TestBed.createComponent(RecentQuizMeta);
    fixture.componentRef.setInput('score', 95);
    fixture.componentRef.setInput('completedAtLabel', 'Just now');
    fixture.detectChanges();

    const paragraph = fixture.nativeElement.querySelector('p');

    expect(paragraph?.classList.contains('text-success-text-light')).toBe(true);
  });

  it('should update styles when the score changes', () => {
    const fixture = TestBed.createComponent(RecentQuizMeta);
    fixture.componentRef.setInput('score', 40);
    fixture.componentRef.setInput('completedAtLabel', '5 min ago');
    fixture.detectChanges();

    let paragraph = fixture.nativeElement.querySelector('p');
    expect(paragraph?.classList.contains('text-warning-text-light')).toBe(true);

    fixture.componentRef.setInput('score', 80);
    fixture.detectChanges();

    paragraph = fixture.nativeElement.querySelector('p');
    expect(paragraph?.classList.contains('text-success-text-light')).toBe(true);
  });
});