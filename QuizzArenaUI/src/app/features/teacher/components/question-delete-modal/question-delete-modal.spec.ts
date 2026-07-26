import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ModalRef } from '../../../../core/services/modal.service';
import { Question } from '../../models/question';
import { QuestionDeleteModal } from './question-delete-modal';

describe('QuestionDeleteModal', () => {
  let component: QuestionDeleteModal;
  let fixture: ComponentFixture<QuestionDeleteModal>;
  let mockModalRef: Partial<ModalRef>;

  const question: Question = {
    ...new Question(),
    id: 'question-1',
    content: 'What is DDD?',
  };

  beforeEach(async () => {
    mockModalRef = {
      close: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [QuestionDeleteModal],
      providers: [{ provide: ModalRef, useValue: mockModalRef }],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionDeleteModal);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('question', question);
    fixture.detectChanges();
  });

  it('should render delete confirmation text', () => {
    const textContent = fixture.nativeElement.textContent;

    expect(textContent).toContain('Are you sure that you want to delete this item');
    expect(textContent).toContain('What is DDD?');
    expect(textContent).toContain('Cancel');
    expect(textContent).toContain('Delete');
  });

  it('should close without result when canceling', () => {
    component.handleCloseModalEvent();

    expect(mockModalRef.close).toHaveBeenCalledWith();
  });

  it('should close with question id when confirming delete', () => {
    component.handleDeleteClick();

    expect(mockModalRef.close).toHaveBeenCalledWith('question-1');
  });
});
