import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { LOCALE_ID } from '@angular/core';
import { ExamBankCheckAllMatchesPage } from './exam-bank-check-all-matches-page';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { Match } from '../../models/exam.model';
import { Location } from '@angular/common';
import { DEFAULT_PAGE_SIZE } from '../../../../core/models/pagination.model';

const MOCK_MATCHES: Match[] = [
  { id: 'm1', quizId: 'quiz-1', title: 'Quiz 1 Match', courseName: 'AI Course', questionCount: 5, professorName: 'Prof', duration: 30, status: 'Active' },
];

describe('ExamBankCheckAllMatchesPage', () => {
  let component: ExamBankCheckAllMatchesPage;
  let fixture: ComponentFixture<ExamBankCheckAllMatchesPage>;
  let mockExamService: Partial<TeacherExamService>;

  beforeEach(async () => {
    mockExamService = {
      getMatches: vi.fn().mockReturnValue(of(MOCK_MATCHES)),
      unpublishMatch: vi.fn().mockReturnValue(of(undefined)),
    };

    await TestBed.configureTestingModule({
      imports: [ExamBankCheckAllMatchesPage],
      providers: [
        provideRouter([]),
        { provide: TeacherExamService, useValue: mockExamService },
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

  it('should trigger location back when window history length is > 1', () => {
    vi.spyOn(window.history, 'length', 'get').mockReturnValue(2);
    const location = TestBed.inject(Location);
    const backSpy = vi.spyOn(location, 'back');
    component.goBack();
    expect(backSpy).toHaveBeenCalled();
  });

  it('should navigate to exam bank page when window history length is <= 1', () => {
    vi.spyOn(window.history, 'length', 'get').mockReturnValue(1);
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component.goBack();
    expect(navigateSpy).toHaveBeenCalledWith(['/teacher/exams/bank']);
  });

  it('should increment matchPage when loadMoreMatches is called and isHasMoreMatches is true', () => {
    component.isHasMoreMatches.set(true);
    component.loadMoreMatches();
    expect(component.matchPage()).toBe(2);
  });
});
