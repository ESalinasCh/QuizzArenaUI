import { provideHttpClient } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { StudentQuizService } from '../../services/student-quiz.service';
import { StudentQuizListPage } from './quiz-list-page';

describe('StudentQuizListPage', () => {
  let mockAuthService: Partial<AuthService>;
  let mockStudentQuizService: Partial<StudentQuizService>;

  beforeEach(() => {
    mockAuthService = {
      currentUser: vi.fn() as unknown as AuthService['currentUser'],
    };
    mockStudentQuizService = {
      getDashboard: vi.fn().mockReturnValue(of({ availableQuizzes: [], recentQuizzes: [] })),
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: AuthService, useValue: mockAuthService },
        { provide: StudentQuizService, useValue: mockStudentQuizService },
        { provide: LOCALE_ID, useValue: 'en' },
      ],
    });
  });

  it('should render welcome heading', () => {
    (mockAuthService.currentUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ name: 'John Doe', username: 'johndoe' });

    const fixture = TestBed.createComponent(StudentQuizListPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Welcome');
  });

  it('should use username when name is not available', () => {
    (mockAuthService.currentUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ username: 'johndoe', roles: [] });

    const fixture = TestBed.createComponent(StudentQuizListPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('johndoe');
  });

  it('should render quiz access form', () => {
    (mockAuthService.currentUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue(null);

    const fixture = TestBed.createComponent(StudentQuizListPage);
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('qz-quiz-access-form');
    expect(form).toBeTruthy();
  });

  it('should navigate to quiz start on startQuiz', async () => {
    (mockAuthService.currentUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue(null);
    const fixture = TestBed.createComponent(StudentQuizListPage);
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    await fixture.componentInstance.startQuiz('quiz-1');
    expect(navigateSpy).toHaveBeenCalledWith(['/student/quizzes', 'quiz-1', 'start']);
  });

  it('should navigate to quiz results with view=details on viewResults', async () => {
    (mockAuthService.currentUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue(null);
    const fixture = TestBed.createComponent(StudentQuizListPage);
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    await fixture.componentInstance.viewResults('a1');
    expect(navigateSpy).toHaveBeenCalledWith(['/student/quizzes', 'a1', 'results'], { queryParams: { view: 'details' } });
  });

  it('should extract quizId from link and start quiz on goToQuizFromLink', async () => {
    (mockAuthService.currentUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue(null);
    const fixture = TestBed.createComponent(StudentQuizListPage);
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    await fixture.componentInstance.goToQuizFromLink('https://example.com/quiz/abc-123');
    expect(navigateSpy).toHaveBeenCalledWith(['/student/quizzes', 'abc-123', 'start']);
  });

  it('should ignore empty link on goToQuizFromLink', async () => {
    (mockAuthService.currentUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue(null);
    const fixture = TestBed.createComponent(StudentQuizListPage);
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    await fixture.componentInstance.goToQuizFromLink('');
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should use link directly if no slashes found', async () => {
    (mockAuthService.currentUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue(null);
    const fixture = TestBed.createComponent(StudentQuizListPage);
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    await fixture.componentInstance.goToQuizFromLink('simple-id');
    expect(navigateSpy).toHaveBeenCalledWith(['/student/quizzes', 'simple-id', 'start']);
  });

  it('should keep empty dashboard when dashboard request fails', () => {
    mockStudentQuizService.getDashboard = vi.fn().mockReturnValue(
      throwError(() => new Error('Dashboard failed')),
    );
    (mockAuthService.currentUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue(null);

    const fixture = TestBed.createComponent(StudentQuizListPage);
    fixture.detectChanges();

    expect(fixture.componentInstance.dashboard()).toEqual({
      availableQuizzes: [],
      recentQuizzes: [],
    });
  });
});
