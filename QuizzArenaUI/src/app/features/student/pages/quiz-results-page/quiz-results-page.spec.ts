import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { StudentQuizService } from '../../services/student-quiz.service';
import { StudentQuizResultsPage } from './quiz-results-page';

describe('StudentQuizResultsPage', () => {
  let mockStudentQuizService: Partial<StudentQuizService>;

  const mockSummary = {
    attemptId: 'attempt-1', title: 'Quiz 1', subtitle: 'DDD',
    scorePercentage: 80, correctCount: 4, incorrectCount: 1, totalQuestions: 5,
    message: 'Good job!',
  };

  beforeEach(() => {
    mockStudentQuizService = {
      getMatchAttemptResultSummary: vi.fn().mockReturnValue(of(mockSummary)),
      getMatchAttemptDetail: vi.fn().mockReturnValue(of({
        id: 'attempt-1', title: 'Quiz 1', subtitle: 'DDD', score: 80,
        questions: [{ id: 'q1', number: 1, text: 'Q1', selectedAnswerLabel: 'Answer A', isCorrect: true }],
      })),
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: StudentQuizService, useValue: mockStudentQuizService },
        { provide: ActivatedRoute, useValue: { paramMap: of(new Map([['quizId', 'attempt-1']])), snapshot: { queryParamMap: new Map() } } },
        { provide: LOCALE_ID, useValue: 'en' },
      ],
    });
  });

  it('should render summary title and subtitle', () => {
    const fixture = TestBed.createComponent(StudentQuizResultsPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Quiz 1');
    expect(fixture.nativeElement.textContent).toContain('DDD');
  });

  it('should render score percentage', () => {
    const fixture = TestBed.createComponent(StudentQuizResultsPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('80%');
  });

  it('should render correct and incorrect stats', () => {
    const fixture = TestBed.createComponent(StudentQuizResultsPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('4');
    expect(fixture.nativeElement.textContent).toContain('1');
  });

  it('should render message', () => {
    const fixture = TestBed.createComponent(StudentQuizResultsPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Good job!');
  });

  it('should set showDetails on viewDetails', () => {
    const fixture = TestBed.createComponent(StudentQuizResultsPage);
    fixture.detectChanges();

    expect(fixture.componentInstance.showDetails()).toBe(false);
    fixture.componentInstance.viewDetails();
    expect(fixture.componentInstance.showDetails()).toBe(true);
  });

  it('should navigate home on goHome', async () => {
    const fixture = TestBed.createComponent(StudentQuizResultsPage);
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    await fixture.componentInstance.goHome();
    expect(navigateSpy).toHaveBeenCalledWith(['/student/quizzes']);
  });
});
