import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { TeacherExamBankPage } from './exam-bank-page';
import { QuizResponseAsExams } from '../../api/teacher-exam.contract';

const MOCK_QUIZZES: QuizResponseAsExams[] = [
  { id: 'exam-draft-1', title: 'DDD Fundamentals', description: 'Core DDD', status: 'draft', origin: 'ManuallyCreated', questions: [{ questionId: 'q1', position: 1, valueScore: 10, content: 'Q1', type: 'SingleChoice' }] },
  { id: 'exam-draft-2', title: 'Hexagonal Architecture', description: 'Ports and adapters', status: 'draft', origin: 'ManuallyCreated', questions: [{ questionId: 'q3', position: 1, valueScore: 10, content: 'Q3', type: 'SingleChoice' }] },
  { id: 'exam-pub-1', title: 'DDD Week 1', description: 'Published exam', status: 'published', origin: 'ManuallyCreated', questions: [{ questionId: 'q4', position: 1, valueScore: 10, content: 'Q4', type: 'SingleChoice' }] },
];

describe('TeacherExamBankPage', () => {
  let mockExamService: Partial<TeacherExamService>;

  beforeEach(() => {
    mockExamService = {
      getExams: vi.fn().mockReturnValue(of([])),
      getQuizzesAsExams: vi.fn().mockReturnValue(of(MOCK_QUIZZES)),
      getMatches: vi.fn().mockReturnValue(of([])),
      unpublishMatch: vi.fn().mockReturnValue(of(undefined)),
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: TeacherExamService, useValue: mockExamService },
        { provide: LOCALE_ID, useValue: 'en' },
      ],
    });
  });

  it('should load quizzes as exams', () => {
    const fixture = TestBed.createComponent(TeacherExamBankPage);
    fixture.detectChanges();
    const quizzes = fixture.componentInstance.quizzesAsExams();
    expect(quizzes.length).toBe(3);
  });

  it('should navigate to /teacher/exams/create on createExam', async () => {
    const fixture = TestBed.createComponent(TeacherExamBankPage);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await fixture.componentInstance.createExam();
    expect(navigateSpy).toHaveBeenCalledWith(['/teacher/exams/create']);
  });

  it('should navigate to publish with exam id on publishExam', () => {
    const fixture = TestBed.createComponent(TeacherExamBankPage);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.componentInstance.publishExam(MOCK_QUIZZES[0]);
    expect(navigateSpy).toHaveBeenCalledWith(['/teacher/exams/publish', 'exam-draft-1']);
  });

  it('should call unpublishMatch on TeacherExamService when unpublishMatch is invoked', () => {
    const fixture = TestBed.createComponent(TeacherExamBankPage);
    fixture.detectChanges();
    const mockMatch = { id: 'm1', title: 'M1', courseName: 'C1', questionCount: 5, professorName: 'P', duration: 30 };
    fixture.componentInstance.unpublishMatch(mockMatch);
    expect(mockExamService.unpublishMatch).toHaveBeenCalledWith('m1');
  });
});
