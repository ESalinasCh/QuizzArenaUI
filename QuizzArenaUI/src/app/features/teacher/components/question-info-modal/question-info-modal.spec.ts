import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ModalRef } from '../../../../core/services/modal.service';
import { Question } from '../../models/question';
import { QuestionInfoModal } from './question-info-modal';

describe('QuestionInfoModal', () => {
  let component: QuestionInfoModal;
  let fixture: ComponentFixture<QuestionInfoModal>;
  let mockModalRef: Partial<ModalRef>;

  const question: Question = {
    ...new Question(),
    id: 'question-1',
    content: 'What is DDD?',
    createdAt: new Date('2026-07-26T00:00:00Z'),
    processingJobId: 'job-1',
    status: 'Verified',
    justification: 'Domain Driven Design is the correct answer.',
  };

  beforeEach(async () => {
    mockModalRef = {
      close: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [QuestionInfoModal],
      providers: [{ provide: ModalRef, useValue: mockModalRef }],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionInfoModal);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('question', question);
    fixture.detectChanges();
  });

  it('should render question details', () => {
    const textContent = fixture.nativeElement.textContent;

    expect(textContent).toContain('What is DDD?');
    expect(textContent).toContain('Processing Job Id:');
    expect(textContent).toContain('job-1');
    expect(textContent).toContain('Status:');
    expect(textContent).toContain('Verified');
    expect(textContent).toContain('Justification:');
    expect(textContent).toContain('Domain Driven Design is the correct answer.');
  });

  it('should close the modal', () => {
    component.handleCloseModalEvent();

    expect(mockModalRef.close).toHaveBeenCalledOnce();
  });
});
