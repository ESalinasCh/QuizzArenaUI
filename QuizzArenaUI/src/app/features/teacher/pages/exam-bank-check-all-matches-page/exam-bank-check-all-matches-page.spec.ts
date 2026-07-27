import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { LOCALE_ID } from '@angular/core';
import { ExamBankCheckAllMatchesPage } from './exam-bank-check-all-matches-page';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { Match } from '../../models/exam.model';

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

  it('should load matches for given quizId', () => {
    fixture.detectChanges();
    expect(mockExamService.getMatches).toHaveBeenCalledWith({ quizId: 'quiz-1' });
    expect(component.matches().length).toBe(1);
  });
});
