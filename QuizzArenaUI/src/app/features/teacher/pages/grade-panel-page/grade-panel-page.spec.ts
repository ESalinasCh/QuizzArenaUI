import { TestBed } from "@angular/core/testing";
import { TeacherExamService } from "../../services/teacher-exam.service";
import { provideRouter } from "@angular/router";
import { LOCALE_ID } from "@angular/core";
import { of } from "rxjs";
import { Grade, Match } from "../../models/exam.model";
import { ModalService } from "../../../../core/services/modal.service";
import { ResetAttemptModal } from "../../components/reset-attempt-modal/reset-attempt-modal";
import { TeacherGradePanelPage } from "./grade-panel-page";


describe('TeacherGradePanelPage', () => {
    let mockExamService: Partial<TeacherExamService>;
    let mockModalService: Partial<ModalService>;

    const mockMatches: Match[] = [
        {
            id: 'match-1',
            title: 'Math Quiz',
            courseName: 'Mathematics',
            questionCount: 5,
            professorName: 'Prof. Jane',
            duration: 45,
        },
        {
            id: 'match-2',
            title: 'Science Quiz',
            courseName: 'Science',
            questionCount: 8,
            professorName: 'Prof. John',
            duration: 60,
        },
    ];

    const mockGrades: Grade[] = [
        {
            id: 'grade-1',
            nickname: 'Alice',
            status: 'Completed',
            score: 95,
            userId: 'user-1',
            matchId: 'match-1',
            otherAttempts: [],
        },
        {
            id: 'grade-2',
            nickname: 'Bob',
            status: 'InProgress',
            score: 72,
            userId: 'user-2',
            matchId: 'match-1',
            otherAttempts: [
                { id: 'attempt-1', nickname: 'Bob', status: 'Completed', score: 68 },
            ],
        },
    ];

    beforeEach(async () => {
        mockExamService = {
            getMatches: vi.fn().mockReturnValue(of(mockMatches)),
            getGrades: vi.fn().mockReturnValue(of(mockGrades)),
        };

        mockModalService = {
            open: vi.fn().mockReturnValue({ afterClosed: Promise.resolve(undefined) }),
        };

        await TestBed.configureTestingModule({
            imports: [TeacherGradePanelPage],
            providers: [
                provideRouter([]),
                { provide: TeacherExamService, useValue: mockExamService },
                { provide: ModalService, useValue: mockModalService },
                { provide: LOCALE_ID, useValue: 'en' },
            ],
        }).compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(TeacherGradePanelPage);
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('should render match options', () => {
        const fixture = TestBed.createComponent(TeacherGradePanelPage);
        fixture.detectChanges();
        const options = fixture.nativeElement.querySelectorAll('option');
        expect(options.length).toBe(3);
        expect(fixture.nativeElement.textContent).toContain('Math Quiz');
        expect(fixture.nativeElement.textContent).toContain('Science Quiz');
    });

    it('should update selected match when select changes', () => {
        const fixture = TestBed.createComponent(TeacherGradePanelPage);
        fixture.detectChanges();
        const select = fixture.nativeElement.querySelector('select');
        select.value = 'match-1';
        select.dispatchEvent(new Event('change'));
        fixture.detectChanges();
        expect(fixture.componentInstance.selectedMatchId()).toBe('match-1');
    });

    it('should compute selectedMatch', () => {
        const fixture = TestBed.createComponent(TeacherGradePanelPage);
        fixture.detectChanges();
        fixture.componentInstance.onMatchChange('match-2');
        expect(fixture.componentInstance.selectedMatch()).toEqual(mockMatches[1]);
    });

    it('should call getGrades when selecting a match', async () => {
        const fixture = TestBed.createComponent(TeacherGradePanelPage);
        fixture.detectChanges();
        fixture.componentInstance.onMatchChange('match-1');
        await fixture.whenStable();
        fixture.detectChanges();
        await fixture.componentInstance.grades.reload();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(mockExamService.getGrades).toHaveBeenCalledWith(
            'match-1',
            {
                Page: 1,
                PageSize: 10,
            },
        );
    });

    it('should not call getGrades before selecting a match', () => {
        const fixture = TestBed.createComponent(TeacherGradePanelPage);
        fixture.detectChanges();
        expect(mockExamService.getGrades).not.toHaveBeenCalled();
    });

    it('should expand grade attempts', () => {
        const fixture = TestBed.createComponent(TeacherGradePanelPage);
        fixture.componentInstance.toggleAttempts('grade-1');
        expect(fixture.componentInstance.expandedGrades()).toEqual(['grade-1']);
    });

    it('should collapse expanded grade', () => {
        const fixture = TestBed.createComponent(TeacherGradePanelPage);
        fixture.componentInstance.toggleAttempts('grade-1');
        fixture.componentInstance.toggleAttempts('grade-1');
        expect(fixture.componentInstance.expandedGrades()).toEqual([]);
    });

    it('should display no grades message when there are no grades', async () => {
        (mockExamService.getGrades as ReturnType<typeof vi.fn>).mockReturnValue(of([]));
        const fixture = TestBed.createComponent(TeacherGradePanelPage);
        fixture.componentInstance.onMatchChange('match-1');
        await fixture.componentInstance.grades.reload();
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent).toContain("You don't have any grades.");
    });

    it('should render a grade card for every grade', async () => {
        (mockExamService.getGrades as ReturnType<typeof vi.fn>).mockReturnValue(of(mockGrades));
        const fixture = TestBed.createComponent(TeacherGradePanelPage);
        fixture.componentInstance.onMatchChange('match-1');
        await fixture.whenStable();
        fixture.detectChanges();
        await fixture.componentInstance.grades.reload();
        await fixture.whenStable();
        fixture.detectChanges();

        const cards = fixture.nativeElement.querySelectorAll('qz-grade-card');
        expect(cards.length).toBe(2);
    });

    it('should open the reset modal for the selected grade', () => {
        mockModalService.open = vi.fn().mockReturnValue({ afterClosed: Promise.resolve(undefined) });
        const fixture = TestBed.createComponent(TeacherGradePanelPage);
        const component = fixture.componentInstance;
        vi.spyOn(component.grades, 'value').mockReturnValue([mockGrades[0]] as Grade[]);

        component.onResetAttempts('grade-1');

        expect(mockModalService.open).toHaveBeenCalledWith(
            ResetAttemptModal,
            { attempt: mockGrades[0] },
            { title: 'Reset Attempts' },
        );
    });

    it('should reset attempts when modal returns a userId', async () => {
        let resolveAfterClosed: (value: string | undefined) => void = () => {};
        const afterClosed = new Promise<string | undefined>((resolve) => {
            resolveAfterClosed = resolve;
        });

        mockModalService.open = vi.fn().mockReturnValue({ afterClosed });
        mockExamService.resetAttempts = vi.fn().mockReturnValue(of(undefined));

        const fixture = TestBed.createComponent(TeacherGradePanelPage);
        const component = fixture.componentInstance;
        const resetSpy = vi.spyOn(component as any, 'resetAttempts');

        component.openResetModal(mockGrades[0]);
        resolveAfterClosed('user-1');
        await afterClosed;

        expect(resetSpy).toHaveBeenCalledWith('user-1');
    });

    it('should reload grades after successful resetAttempts', async () => {
        mockExamService.resetAttempts = vi.fn().mockReturnValue(of(undefined));
        const fixture = TestBed.createComponent(TeacherGradePanelPage);
        const component = fixture.componentInstance;
        const reloadSpy = vi.spyOn(component.grades, 'reload');

        component['resetAttempts']('user-1');
        await Promise.resolve();

        expect(mockExamService.resetAttempts).toHaveBeenCalledWith('user-1');
        expect(reloadSpy).toHaveBeenCalled();
    });
});
