import { TestBed } from '@angular/core/testing';
import { StudentSectionTitle } from './student-section-title';

describe('StudentSectionTitle', () => {
  it('should render title', () => {
    const fixture = TestBed.createComponent(StudentSectionTitle);
    fixture.componentRef.setInput('title', 'Available Quizzes');
    fixture.componentRef.setInput('icon', 'sparkles');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Available Quizzes');
  });

  it('should render icon', () => {
    const fixture = TestBed.createComponent(StudentSectionTitle);
    fixture.componentRef.setInput('title', 'Recent Quizzes');
    fixture.componentRef.setInput('icon', 'clock');
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('qz-icon');
    expect(icon).toBeTruthy();
  });
});
