import { TestBed } from '@angular/core/testing';
import { TeacherQuizManagementPage } from './quiz-management-page';

describe('TeacherQuizManagementPage', () => {
  it('should render placeholder text', () => {
    const fixture = TestBed.createComponent(TeacherQuizManagementPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Quiz management');
    expect(fixture.nativeElement.innerHTML).toContain('Search your question here');
  });

  it('should render teacher label', () => {
    const fixture = TestBed.createComponent(TeacherQuizManagementPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Teacher');
  });
});
