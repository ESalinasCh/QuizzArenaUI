import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { StudentQuizService } from '../../services/student-quiz.service';
import { StudentQuizQuestionPage } from './quiz-question-page';

describe('StudentQuizQuestionPage', () => {
  let mockStudentQuizService: Partial<StudentQuizService>;

  const mockQuizStart = {
    id: 'quiz-1', title: 'Quiz 1', subtitle: 'DDD',
    matchId: 'quiz-1', attemptId: 'attempt-1',
    professorName: 'Prof A', questionCount: 2, timeLimitMinutes: 10,
    questions: [
      { id: 'q1', statement: 'Question 1', options: [{ id: 'q1-a', label: 'A' }, { id: 'q1-b', label: 'B' }] },
      { id: 'q2', statement: 'Question 2', options: [{ id: 'q2-a', label: 'A' }, { id: 'q2-b', label: 'B' }] },
    ],
  };

  beforeEach(() => {
    mockStudentQuizService = {
      getActiveQuizStart: vi.fn().mockReturnValue(mockQuizStart),
      submitMatchAttempt: vi.fn().mockReturnValue(of({ attemptId: 'attempt-1' })),
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

  it('should render question statement', () => {
    const fixture = TestBed.createComponent(StudentQuizQuestionPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Question 1');
  });

  it('should render progress label', () => {
    const fixture = TestBed.createComponent(StudentQuizQuestionPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Question 1 of 2');
  });

  it('should render option buttons', () => {
    const fixture = TestBed.createComponent(StudentQuizQuestionPage);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const optionButtons = [...buttons].filter(
      b => b.textContent?.trim().includes('A') && b.textContent?.trim().includes('B'),
    );
    expect(optionButtons.length).toBe(0);
    expect(buttons.length).toBe(3);
  });

  it('should select option on selectOption', () => {
    const fixture = TestBed.createComponent(StudentQuizQuestionPage);
    fixture.detectChanges();

    fixture.componentInstance.selectOption('q1-a');
    expect(fixture.componentInstance.selectedOptionId()).toBe('q1-a');
  });

  it('should advance to next question on confirmAnswer', () => {
    const fixture = TestBed.createComponent(StudentQuizQuestionPage);
    fixture.detectChanges();

    fixture.componentInstance.selectOption('q1-a');
    fixture.componentInstance.confirmAnswer();

    expect(fixture.componentInstance.questionIndex()).toBe(1);
    expect(fixture.componentInstance.selectedOptionId()).toBeNull();
    expect(fixture.componentInstance.answers().length).toBe(1);
    expect(fixture.componentInstance.answers()[0].questionId).toBe('q1');
  });

  it('should submit when confirming last question', () => {
    const fixture = TestBed.createComponent(StudentQuizQuestionPage);
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.componentInstance.selectOption('q1-a');
    fixture.componentInstance.confirmAnswer();

    fixture.componentInstance.selectOption('q2-a');
    fixture.componentInstance.confirmAnswer();

    expect(mockStudentQuizService.submitMatchAttempt).toHaveBeenCalledWith('attempt-1', {
      answers: [
        expect.objectContaining({ questionId: 'q1', selectedOptionId: 'q1-a' }),
        expect.objectContaining({ questionId: 'q2', selectedOptionId: 'q2-a' }),
      ],
    });
  });

  it('should not confirm if no option selected', () => {
    const fixture = TestBed.createComponent(StudentQuizQuestionPage);
    fixture.detectChanges();

    fixture.componentInstance.confirmAnswer();

    expect(fixture.componentInstance.questionIndex()).toBe(0);
  });

});
