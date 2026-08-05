import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { TeacherExamBankPage } from './exam-bank-page';
import { QuizResponseAsExams } from '../../api/teacher-exam.contract';
import { Match } from '../../models/exam.model';
import { ModalService } from '../../../../core/services/modal.service';

const MOCK_QUIZZES: QuizResponseAsExams[] = [
  { id: 'exam-draft-1', title: 'DDD Fundamentals', description: 'Core DDD', status: 'draft', origin: 'ManuallyCreated', questions: [{ questionId: 'q1', position: 1, valueScore: 10, content: 'Q1', type: 'SingleChoice' }] },
  { id: 'exam-draft-2', title: 'Hexagonal Architecture', description: 'Ports and adapters', status: 'draft', origin: 'ManuallyCreated', questions: [{ questionId: 'q3', position: 1, valueScore: 10, content: 'Q3', type: 'SingleChoice' }] },
  { id: 'exam-pub-1', title: 'DDD Week 1', description: 'Published exam', status: 'published', origin: 'ManuallyCreated', questions: [{ questionId: 'q4', position: 1, valueScore: 10, content: 'Q4', type: 'SingleChoice' }] },
];

const MOCK_MATCHES: Match[] = [
  { id: 'm1', quizId: 'exam-draft-1', title: 'M1', courseName: 'C1', questionCount: 5, professorName: 'P', duration: 30 },
];

describe('TeacherExamBankPage', () => {
  let mockExamService: Partial<TeacherExamService>;
  let mockModalService: Partial<ModalService>;

  beforeEach(() => {
    mockExamService = {
      getExams: vi.fn().mockReturnValue(of([])),
      getQuizzesAsExams: vi.fn().mockReturnValue(of(MOCK_QUIZZES)),
      getMatches: vi.fn().mockReturnValue(of(MOCK_MATCHES)),
      unpublishMatch: vi.fn().mockReturnValue(of(undefined)),
    };
    mockModalService = {
      open: vi.fn().mockReturnValue({ afterClosed: Promise.resolve('m1') }),
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: TeacherExamService, useValue: mockExamService },
        { provide: ModalService, useValue: mockModalService },
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
    const mockMatch: Match = { id: 'm1', title: 'M1', courseName: 'C1', questionCount: 5, professorName: 'P', duration: 30 };
    fixture.componentInstance.unpublishMatch(mockMatch);
    expect(mockExamService.unpublishMatch).toHaveBeenCalledWith('m1');
  });

  it('should open unpublish modal when onUnpublishMatch is called for an existing match', async () => {
    const fixture = TestBed.createComponent(TeacherExamBankPage);
    fixture.detectChanges();
    await fixture.whenStable();

    const mockMatch: Match = { id: 'm1', quizId: 'exam-draft-1', title: 'M1', courseName: 'C1', questionCount: 5, professorName: 'P', duration: 30 };
    fixture.componentInstance.onUnpublishMatch(mockMatch);

    expect(mockModalService.open).toHaveBeenCalled();
  });

  it('should navigate to matches list on goToQuizMatches', async () => {
    const fixture = TestBed.createComponent(TeacherExamBankPage);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await fixture.componentInstance.goToQuizMatches('exam-draft-1');
    expect(navigateSpy).toHaveBeenCalledWith(['/teacher/exams/bank', 'exam-draft-1', 'matches']);
  });

  it('should navigate to questions view with the quiz in router state on viewQuestions', async () => {
    const fixture = TestBed.createComponent(TeacherExamBankPage);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await fixture.componentInstance.viewQuestions(MOCK_QUIZZES[0]);
    expect(navigateSpy).toHaveBeenCalledWith(
      ['/teacher/exams/bank', 'exam-draft-1', 'questions'],
      { state: { quiz: MOCK_QUIZZES[0] } },
    );
  });

  it('should increment pageForQuizAsExams on loadMoreQuizzesAsExams', () => {
    const fixture = TestBed.createComponent(TeacherExamBankPage);
    fixture.detectChanges();
    fixture.componentInstance.loadMoreQuizzesAsExams();
    expect(fixture.componentInstance.pageForQuizAsExams()).toBe(2);
  });

  it('should call activateMatchAsActiveExam on publishMatch and update match status to Active', () => {
    mockExamService.activateMatchAsActiveExam = vi.fn().mockReturnValue(of(undefined));
    const fixture = TestBed.createComponent(TeacherExamBankPage);
    fixture.detectChanges();
    const mockMatch: Match = { id: 'm1', title: 'M1', courseName: 'C1', questionCount: 5, professorName: 'P', duration: 30, status: 'Pending' };
    fixture.componentInstance.publishMatch(mockMatch);
    expect(mockExamService.activateMatchAsActiveExam).toHaveBeenCalledWith('m1');
  });
});
