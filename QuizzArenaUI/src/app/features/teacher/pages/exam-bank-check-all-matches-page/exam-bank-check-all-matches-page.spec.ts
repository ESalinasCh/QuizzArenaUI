import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { LOCALE_ID } from '@angular/core';
import { ExamBankCheckAllMatchesPage } from './exam-bank-check-all-matches-page';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { Match } from '../../models/exam.model';
import { DEFAULT_PAGE_SIZE } from '../../../../core/models/pagination.model';
import { NavigationHistoryService } from '../../../../core/services/navigation-history.service';

const MOCK_MATCHES: Match[] = [
  { id: 'm1', quizId: 'quiz-1', title: 'Quiz 1 Match', courseName: 'AI Course', questionCount: 5, professorName: 'Prof', duration: 30, status: 'Active' },
];

describe('ExamBankCheckAllMatchesPage', () => {
  let component: ExamBankCheckAllMatchesPage;
  let fixture: ComponentFixture<ExamBankCheckAllMatchesPage>;
  let mockExamService: Partial<TeacherExamService>;
  let mockNavHistoryService: Partial<NavigationHistoryService>;

  beforeEach(async () => {
    mockExamService = {
      getMatches: vi.fn().mockReturnValue(of(MOCK_MATCHES)),
      unpublishMatch: vi.fn().mockReturnValue(of(undefined)),
    };
    mockNavHistoryService = {
      back: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ExamBankCheckAllMatchesPage],
      providers: [
        provideRouter([]),
        { provide: TeacherExamService, useValue: mockExamService },
        { provide: NavigationHistoryService, useValue: mockNavHistoryService },
        { provide: LOCALE_ID, useValue: 'en' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExamBankCheckAllMatchesPage);
    fixture.componentRef.setInput('quizId', 'quiz-1');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load matches for given quizId with default page and pageSize', () => {
    fixture.detectChanges();
    expect(mockExamService.getMatches).toHaveBeenCalledWith({
      quizId: 'quiz-1',
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
    });
    expect(component.matches().length).toBe(1);
  });

  it('should call unpublishMatch service on unpublishMatch invocation', () => {
    fixture.detectChanges();
    component.unpublishMatch(MOCK_MATCHES[0]);
    expect(mockExamService.unpublishMatch).toHaveBeenCalledWith('m1');
  });

  it('should call navigationHistoryService.back on goBack', () => {
    component.goBack();
    expect(mockNavHistoryService.back).toHaveBeenCalledWith('/teacher/exams/bank');
  });

  it('should increment matchPage when loadMoreMatches is called and isHasMoreMatches is true', () => {
    component.isHasMoreMatches.set(true);
    component.loadMoreMatches();
    expect(component.matchPage()).toBe(2);
  });

  it('should call activateMatchAsActiveExam and update match status to Active on publishMatch', () => {
    mockExamService.activateMatchAsActiveExam = vi.fn().mockReturnValue(of(undefined));
    fixture.detectChanges();
    const pendingMatch: Match = { id: 'm1', quizId: 'quiz-1', title: 'Match 1', courseName: 'AI Course', questionCount: 5, professorName: 'Prof', duration: 30, status: 'Pending' };
    component.publishMatch(pendingMatch);
    expect(mockExamService.activateMatchAsActiveExam).toHaveBeenCalledWith('m1');
  });
});
