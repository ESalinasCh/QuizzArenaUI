import { TestBed } from '@angular/core/testing';
import { SectionTitle } from './section-title';

describe('SectionTitle', () => {
  it('should render the title text', () => {
    const fixture = TestBed.createComponent(SectionTitle);
    fixture.componentRef.setInput('title', 'Available Quizzes');
    fixture.componentRef.setInput('icon', 'quiz');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Available Quizzes');
  });

  it('should render the icon', () => {
    const fixture = TestBed.createComponent(SectionTitle);
    fixture.componentRef.setInput('title', 'Results');
    fixture.componentRef.setInput('icon', 'chart-bar');
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('qz-icon');
    expect(icon).toBeTruthy();
  });

  it('should display title in an h2 element', () => {
    const fixture = TestBed.createComponent(SectionTitle);
    fixture.componentRef.setInput('title', 'Dashboard');
    fixture.componentRef.setInput('icon', 'dashboard');
    fixture.detectChanges();

    const h2 = fixture.nativeElement.querySelector('h2');
    expect(h2).toBeTruthy();
    expect(h2.textContent).toContain('Dashboard');
  });

  it('should render different icons based on input', () => {
    const fixture = TestBed.createComponent(SectionTitle);
    fixture.componentRef.setInput('title', 'Settings');
    fixture.componentRef.setInput('icon', 'settings');
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('qz-icon');
    expect(icon).toBeTruthy();

    fixture.componentRef.setInput('icon', 'user');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('qz-icon')).toBeTruthy();
  });
});
