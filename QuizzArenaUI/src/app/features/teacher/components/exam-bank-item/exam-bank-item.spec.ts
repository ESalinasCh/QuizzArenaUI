import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExamBankItem } from './exam-bank-item';
import { QuizResponseAsExams } from '../../api/teacher-exam.contract';
import { Match } from '../../models/exam.model';
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

  it('should emit publish when publish button is clicked', () => {
    const spy = vi.spyOn(component.publish, 'emit');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const publishBtn = Array.from<HTMLButtonElement>(buttons).find(b => b.textContent?.includes('Publish'));
    publishBtn?.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit checkOthers when Check Others button is clicked', () => {
    const spy = vi.spyOn(component.checkOthers, 'emit');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const checkOthersBtn = Array.from<HTMLButtonElement>(buttons).find(b => b.textContent?.includes('Check Others'));
    checkOthersBtn?.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should render matches and emit unpublishMatch when unpublish button is clicked', () => {
    const mockMatches: Match[] = [
      { id: 'm1', title: 'M1', courseName: 'Course 101', questionCount: 5, professorName: 'Prof', duration: 45, status: 'Active' },
    ];
    fixture.componentRef.setInput('matches', mockMatches);
    fixture.detectChanges();

    const unpublishSpy = vi.spyOn(component.unpublishMatch, 'emit');
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const unpublishBtn = Array.from<HTMLButtonElement>(buttons).find(b => b.textContent?.includes('Unpublish'));
    unpublishBtn?.click();

    expect(unpublishSpy).toHaveBeenCalledWith(mockMatches[0]);
  });
});
