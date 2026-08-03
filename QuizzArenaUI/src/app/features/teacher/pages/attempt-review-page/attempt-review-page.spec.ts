import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { AttemptReview, Match } from '../../models/exam.model';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { TeacherAttemptReviewPage } from './attempt-review-page';

describe('TeacherAttemptReviewPage', () => {
  let mockExamService: Partial<TeacherExamService>;

  const mockMatches: Match[] = [
    {
      id: 'match-1',
      title: 'Math Exam',
      courseName: 'Mathematics',
      questionCount: 5,
      professorName: 'Prof. Jane',
      duration: 45,
    },
  ];

  const mockReview: AttemptReview = {
    id: 'attempt-1',
    score: 50,
    questions: [
      {
        id: 'question-1',
        number: 1,
        text: 'What is 2 + 2?',
        selectedAnswerLabel: 'Four',
        isCorrect: true,
      },
      {
        id: 'question-2',
        number: 2,
        text: 'What is the capital of Peru?',
        selectedAnswerLabel: 'No answer',
        isCorrect: false,
      },
    ],
  };

  const createComponent = async (inputs: Record<string, string> = {}) => {
    const fixture = TestBed.createComponent(TeacherAttemptReviewPage);
    fixture.componentRef.setInput('attemptId', 'attempt-1');
    fixture.componentRef.setInput('matchId', 'match-1');
    fixture.componentRef.setInput('nickname', 'Alice');

    Object.entries(inputs).forEach(([name, value]) => {
      fixture.componentRef.setInput(name, value);
    });

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    return fixture;
  };

  beforeEach(async () => {
    mockExamService = {
      getMatches: vi.fn().mockReturnValue(of(mockMatches)),
      getAttemptReview: vi.fn().mockReturnValue(of(mockReview)),
    };

    await TestBed.configureTestingModule({
      imports: [TeacherAttemptReviewPage],
      providers: [
        provideRouter([]),
        { provide: TeacherExamService, useValue: mockExamService },
        { provide: LOCALE_ID, useValue: 'en' },
      ],
    }).compileComponents();
  });

  it('should request the review for the attempt in the route', async () => {
    await createComponent();

    expect(mockExamService.getAttemptReview).toHaveBeenCalledWith('attempt-1');
  });

  it('should show the exam title and the student nickname', async () => {
    const fixture = await createComponent();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Math Exam');
    expect(text).toContain('Alice');
    expect(text).toContain('Answer review');
  });

  it('should fall back to the course name when there is no nickname', async () => {
    const fixture = await createComponent({ nickname: '' });

    expect(fixture.componentInstance.subtitle()).toBe('Mathematics');
  });

  it('should fall back to a generic title when the match is unknown', async () => {
    const fixture = await createComponent({ matchId: 'missing-match' });

    expect(fixture.componentInstance.title()).toBe('Attempt review');
  });

  it('should render every reviewed question with its answer', async () => {
    const fixture = await createComponent();

    const articles = fixture.nativeElement.querySelectorAll('article');
    expect(articles.length).toBe(2);

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('What is 2 + 2?');
    expect(text).toContain('Answer: Four');
    expect(text).toContain('Answer: No answer');
  });

  it('should show an empty message when the attempt has no questions', async () => {
    (mockExamService.getAttemptReview as ReturnType<typeof vi.fn>).mockReturnValue(
      of({ ...mockReview, questions: [] }),
    );

    const fixture = await createComponent();

    expect(fixture.nativeElement.textContent).toContain('This attempt has no answered questions.');
  });

  it('should navigate back to the grade panel', async () => {
    const fixture = await createComponent();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    await fixture.componentInstance.goBack();

    expect(navigateSpy).toHaveBeenCalledWith(['/teacher/exams/attempts']);
  });
});
