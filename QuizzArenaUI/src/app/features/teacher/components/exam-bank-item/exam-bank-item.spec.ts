import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExamBankItem } from './exam-bank-item';
import { QuizResponseAsExams } from '../../api/teacher-exam.contract';
import { LOCALE_ID } from '@angular/core';

const MOCK_QUIZ: QuizResponseAsExams = {
  id: 'exam-1',
  title: 'Test Exam',
  description: 'Desc',
  status: 'draft',
  origin: 'ManuallyCreated',
  questions: [
    { questionId: 'q1', position: 1, valueScore: 10, content: 'Q1', type: 'SingleChoice' }
  ],
};

describe('ExamBankItem', () => {
  let component: ExamBankItem;
  let fixture: ComponentFixture<ExamBankItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamBankItem],
      providers: [{ provide: LOCALE_ID, useValue: 'en' }],
    }).compileComponents();

    fixture = TestBed.createComponent(ExamBankItem);
    fixture.componentRef.setInput('quizAsExams', MOCK_QUIZ);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

