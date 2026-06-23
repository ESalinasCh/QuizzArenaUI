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

  it('should default to warning status with warning icon', () => {
    const fixture = TestBed.createComponent(RecentQuizMeta);
    fixture.componentRef.setInput('score', 50);
    fixture.componentRef.setInput('completedAtLabel', '1 day ago');
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('qz-icon');
    expect(icon).toBeTruthy();
    expect(fixture.nativeElement.querySelector('p')?.classList.contains('text-warning-text-light')).toBe(true);
  });

  it('should show check icon and success styles when passed', () => {
    const fixture = TestBed.createComponent(RecentQuizMeta);
    fixture.componentRef.setInput('score', 95);
    fixture.componentRef.setInput('completedAtLabel', 'Just now');
    fixture.componentRef.setInput('status', 'passed');
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('qz-icon');
    expect(icon).toBeTruthy();
    expect(fixture.nativeElement.querySelector('p')?.classList.contains('text-success-text-light')).toBe(true);
  });

  it('should show warning icon and warning styles when status is warning', () => {
    const fixture = TestBed.createComponent(RecentQuizMeta);
    fixture.componentRef.setInput('score', 40);
    fixture.componentRef.setInput('completedAtLabel', '3 days ago');
    fixture.componentRef.setInput('status', 'warning');
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('qz-icon');
    expect(icon).toBeTruthy();
    expect(fixture.nativeElement.querySelector('p')?.classList.contains('text-warning-text-light')).toBe(true);
  });

  it('should update icon when status changes', () => {
    const fixture = TestBed.createComponent(RecentQuizMeta);
    fixture.componentRef.setInput('score', 70);
    fixture.componentRef.setInput('completedAtLabel', '5 min ago');
    fixture.componentRef.setInput('status', 'warning');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p')?.classList.contains('text-warning-text-light')).toBe(true);

    fixture.componentRef.setInput('status', 'passed');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p')?.classList.contains('text-success-text-light')).toBe(true);
  });
});
