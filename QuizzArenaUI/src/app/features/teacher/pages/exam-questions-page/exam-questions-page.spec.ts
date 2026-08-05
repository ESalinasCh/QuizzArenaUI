import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TeacherExamQuestionsPage } from './exam-questions-page';
import { QuestionBankService } from '../../services/question-bank.service';
import { NavigationHistoryService } from '../../../../core/services/navigation-history.service';
import { QuizResponseAsExams } from '../../api/teacher-exam.contract';
import { Question } from '../../models/question';

const MOCK_QUIZ: QuizResponseAsExams = {
  id: 'exam-1',
  title: 'DDD Fundamentals',
  description: 'Desc',
  status: 'draft',
  origin: 'ManuallyCreated',
  questions: [
    { questionId: 'q1', position: 1, valueScore: 10, content: 'Q1', type: 'SingleChoice' },
  ],
};

const MOCK_QUESTIONS: Question[] = [
  { ...new Question(), id: 'q1', content: 'Q1', status: 'Verified', type: 'SingleChoice', options: [
    { id: 'opt-1', description: 'A', isCorrect: true, position: 0, questionId: 'q1' },
  ] },
];

describe('TeacherExamQuestionsPage', () => {
  let mockQuestionBankService: Partial<QuestionBankService>;
  let mockNavHistoryService: Partial<NavigationHistoryService>;

  beforeEach(() => {
    history.pushState({ quiz: MOCK_QUIZ }, '');

    mockQuestionBankService = {
      getQuestions: vi.fn().mockReturnValue(of(MOCK_QUESTIONS)),
    };
    mockNavHistoryService = {
      back: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: QuestionBankService, useValue: mockQuestionBankService },
        { provide: NavigationHistoryService, useValue: mockNavHistoryService },
        { provide: LOCALE_ID, useValue: 'en' },
      ],
    });
  });

  it('should read the quiz from router state', () => {
    const fixture = TestBed.createComponent(TeacherExamQuestionsPage);
    fixture.detectChanges();
    expect(fixture.componentInstance.quiz()).toEqual(MOCK_QUIZ);
    expect(fixture.componentInstance.noQuizData()).toBe(false);
  });

  it('should report noQuizData when there is no router state', () => {
    history.pushState(null, '');
    const fixture = TestBed.createComponent(TeacherExamQuestionsPage);
    fixture.detectChanges();
    expect(fixture.componentInstance.noQuizData()).toBe(true);
  });

  it('should fetch the exam questions directly by their ids', () => {
    const fixture = TestBed.createComponent(TeacherExamQuestionsPage);
    fixture.detectChanges();

    expect(mockQuestionBankService.getQuestions).toHaveBeenCalledWith({
      questionIds: ['q1'],
      pageSize: 1,
      status: 'Verified',
    });
    expect(fixture.componentInstance.questions().map(q => q.id)).toEqual(['q1']);
  });

  it('should render questions as read-only', () => {
    const fixture = TestBed.createComponent(TeacherExamQuestionsPage);
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('qz-admin-question-card');
    expect(card).toBeTruthy();
    // Only the "Information" action should be visible for a read-only card.
    expect(card.querySelectorAll('qz-button').length).toBe(1);
  });

  it('should call navigationHistoryService.back on goBack', () => {
    const fixture = TestBed.createComponent(TeacherExamQuestionsPage);
    fixture.detectChanges();
    fixture.componentInstance.goBack();
    expect(mockNavHistoryService.back).toHaveBeenCalledWith('/teacher/exams/bank');
  });
});
