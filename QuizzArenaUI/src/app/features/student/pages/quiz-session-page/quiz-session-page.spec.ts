import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { StudentQuizService } from '../../services/student-quiz.service';
import { StudentQuizSessionPage } from './quiz-session-page';

describe('StudentQuizSessionPage', () => {
  let mockStudentQuizService: Partial<StudentQuizService>;

  const mockQuizStart = {
    id: 'quiz-1', title: 'Quiz 1', subtitle: 'DDD', professorName: 'Prof A',
    questionCount: 5, timeLimitMinutes: 10, questions: [],
  };

  beforeEach(() => {
    mockStudentQuizService = {
      getQuizStart: vi.fn().mockReturnValue(of(mockQuizStart)),
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: StudentQuizService, useValue: mockStudentQuizService },
        { provide: ActivatedRoute, useValue: { paramMap: of(new Map([['quizId', 'quiz-1']])) } },
        { provide: LOCALE_ID, useValue: 'en' },
      ],
    });
  });

  it('should render quiz title and subtitle', () => {
    const fixture = TestBed.createComponent(StudentQuizSessionPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Quiz 1');
    expect(fixture.nativeElement.textContent).toContain('DDD');
  });

  it('should render professor name', () => {
    const fixture = TestBed.createComponent(StudentQuizSessionPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Prof A');
  });

  it('should navigate to questions page on beginQuiz', async () => {
    const fixture = TestBed.createComponent(StudentQuizSessionPage);
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    await fixture.componentInstance.beginQuiz();
    expect(navigateSpy).toHaveBeenCalledWith(['/student/quizzes', 'quiz-1', 'questions']);
  });

  it('should not navigate if quiz is not loaded on beginQuiz', () => {
    mockStudentQuizService.getQuizStart = vi.fn().mockReturnValue(of(undefined));

    const fixture = TestBed.createComponent(StudentQuizSessionPage);
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    fixture.componentInstance.beginQuiz();
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
