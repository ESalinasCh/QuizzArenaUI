import { provideHttpClient } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { AvailableQuiz } from '../../models/student-quiz.model';
import { StudentQuizService } from '../../services/student-quiz.service';
import { StudentExamListPage } from './exam-list-page';
import { DEFAULT_PAGE_SIZE } from '../../../../core/models/pagination.model';

describe('StudentExamListPage', () => {
    let mockAuthService: Partial<AuthService>;
    let mockStudentQuizService: Partial<StudentQuizService>;
    const exams: AvailableQuiz[] = [
        {
            id: '1', title: 'Exam 1', questionCount: 8, status: 'available',
            mode: 'Exam', duration: 30, attemptsAmount: 3, attemptsUsed: 1, hasActiveAttempt: false,
        },
        {
            id: '2', title: 'Exam 2', questionCount: 5, status: 'new',
            mode: 'Exam', duration: 15, attemptsAmount: 2, attemptsUsed: 2, hasActiveAttempt: true,
        },
    ];

    beforeEach(() => {
        mockAuthService = {};

        mockStudentQuizService = {
            getMatches: vi.fn().mockReturnValue(of([])),
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

    it('should render exams heading', () => {
        const fixture = TestBed.createComponent(StudentExamListPage);

        fixture.detectChanges();

        expect(fixture.nativeElement.textContent).toContain('Exams');
    });

    it('should load pending exams on init', () => {
        const fixture = TestBed.createComponent(StudentExamListPage);
        fixture.detectChanges();

        expect(mockStudentQuizService.getMatches).toHaveBeenCalledWith({
            status: 'Active',
            pageSize: DEFAULT_PAGE_SIZE,
            mode: 'Exam',
        });
    });

    it('should render available exams', async () => {
        (mockStudentQuizService.getMatches as ReturnType<typeof vi.fn>).mockReturnValue(
            of(exams)
        );

        const fixture = TestBed.createComponent(StudentExamListPage);

        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const cards = fixture.nativeElement.querySelectorAll('qz-available-quiz-card');

        expect(cards.length).toBe(2);
    });

    it('should render the exam meta information on each card', async () => {
        (mockStudentQuizService.getMatches as ReturnType<typeof vi.fn>).mockReturnValue(
            of(exams)
        );

        const fixture = TestBed.createComponent(StudentExamListPage);

        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const firstCard = fixture.nativeElement.querySelector('qz-available-quiz-card');
        const rows = Array.from(firstCard.querySelectorAll('dl > div')).map((row) => {
            const term = (row as HTMLElement).querySelector('dt')!.textContent!.trim();
            const definition = (row as HTMLElement).querySelector('dd')!.textContent!.trim();

            return `${term} ${definition}`;
        });

        expect(rows).toEqual(['Questions: 8', 'Status: Available', 'Attempts left: 2']);
    });

    it('should reload exams when status changes', () => {
        const fixture = TestBed.createComponent(StudentExamListPage);

        (mockStudentQuizService.getMatches as ReturnType<typeof vi.fn>).mockClear();

        fixture.componentInstance['changeStatus']('Active');
        fixture.detectChanges();

        expect(mockStudentQuizService.getMatches).toHaveBeenCalledWith({
            status: 'Active',
            pageSize: DEFAULT_PAGE_SIZE,
            mode: 'Exam',
        });
    });

    it('should navigate to start exam', async () => {
        const fixture = TestBed.createComponent(StudentExamListPage);

        const router = TestBed.inject(Router);
        const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

        await fixture.componentInstance.startQuiz('quiz-id');

        expect(navigateSpy).toHaveBeenCalledWith([
            '/student/exams',
            'quiz-id',
            'start',
        ]);
    });

    it('should render empty message when there are no exams', async () => {
        (mockStudentQuizService.getMatches as ReturnType<typeof vi.fn>).mockReturnValue(
            of([])
        );

        const fixture = TestBed.createComponent(StudentExamListPage);

        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(fixture.nativeElement.textContent).toContain(
            fixture.componentInstance.noExamsMessage
        );

        const cards = fixture.nativeElement.querySelectorAll('qz-available-quiz-card');
        expect(cards.length).toBe(0);
    });

    it('should not render empty message when exams are available', async () => {
        (mockStudentQuizService.getMatches as ReturnType<typeof vi.fn>).mockReturnValue(
            of([{ id: '1' }])
        );

        const fixture = TestBed.createComponent(StudentExamListPage);

        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(fixture.nativeElement.textContent).not.toContain(
            fixture.componentInstance.noExamsMessage
        );
    });

    it('should render empty message when exams request fails', async () => {
        (mockStudentQuizService.getMatches as ReturnType<typeof vi.fn>).mockReturnValue(
            throwError(() => new Error('Exams failed'))
        );

        const fixture = TestBed.createComponent(StudentExamListPage);

        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(fixture.nativeElement.textContent).toContain(
            fixture.componentInstance.noExamsMessage
        );
    });
});
