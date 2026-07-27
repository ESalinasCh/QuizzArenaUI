import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExamBankItem } from './exam-bank-item';
import { Exam } from '../../models/exam.model';
import { LOCALE_ID } from '@angular/core';

const MOCK_EXAM: Exam = {
  id: 'exam-1',
  title: 'Test Exam',
  description: 'Desc',
  status: 'draft',
  questionIds: ['q1', 'q2'],
  createdAt: '2026-01-01',
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
    fixture.componentRef.setInput('exam', MOCK_EXAM);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

