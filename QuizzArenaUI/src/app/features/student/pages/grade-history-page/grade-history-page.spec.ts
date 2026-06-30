import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { StudentQuizService } from '../../services/student-quiz.service';
import { StudentGradeHistoryPage } from './grade-history-page';

describe('StudentGradeHistoryPage', () => {
  let mockStudentQuizService: Partial<StudentQuizService>;

  const attemptsMock = [
    {
      id: 'attempt-1',
      title: 'Clase Project I - Semana 7',
      subtitle: 'Domain-Driven Design',
      completedAtLabel: 'Jun 1, 2026',
      durationLabel: '10 min',
      scoreLabel: '80%',
      statusLabel: 'Passed',
      statusVariant: 'success' as const,
    },
  ];

  beforeEach(() => {
    mockStudentQuizService = {
      getGradeHistory: vi.fn().mockReturnValue(of(attemptsMock)),
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: StudentQuizService, useValue: mockStudentQuizService },
        { provide: LOCALE_ID, useValue: 'en' },
      ],
    });
  });

  it('should render grade history title and subtitle', () => {
    const fixture = TestBed.createComponent(StudentGradeHistoryPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Grade History');
    expect(fixture.nativeElement.textContent).toContain('Review your completed exams');
  });

  it('should fetch and render grade history attempts', () => {
    const fixture = TestBed.createComponent(StudentGradeHistoryPage);
    fixture.detectChanges();

    expect(mockStudentQuizService.getGradeHistory).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Clase Project I - Semana 7');
    expect(fixture.nativeElement.textContent).toContain('Domain-Driven Design');
    expect(fixture.nativeElement.textContent).toContain('80%');
    expect(fixture.nativeElement.textContent).toContain('Passed');
  });

  it('should navigate to attempt review details on viewAttempt', async () => {
    const fixture = TestBed.createComponent(StudentGradeHistoryPage);
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    await fixture.componentInstance.viewAttempt('attempt-1');

    expect(navigateSpy).toHaveBeenCalledWith(
      ['/student/quizzes', 'attempt-1', 'results'],
      { queryParams: { view: 'details' } },
    );
  });
});
