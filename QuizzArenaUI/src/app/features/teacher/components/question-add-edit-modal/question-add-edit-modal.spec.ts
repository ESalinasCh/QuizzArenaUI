import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { QuestionEditModal } from './question-add-edit-modal';
import { ModalRef } from '../../../../core/services/modal.service';
import { Question } from '../../models/question';

describe('QuestionEditModal', () => {
  let component: QuestionEditModal;
  let fixture: ComponentFixture<QuestionEditModal>;
  let mockModalRef: Partial<ModalRef>;

  beforeEach(async () => {
    mockModalRef = {
      close: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [QuestionEditModal],
      providers: [
        { provide: ModalRef, useValue: mockModalRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionEditModal);
    component = fixture.componentInstance;
    
    fixture.componentRef.setInput('question', {
      id: 'q-1',
      content: 'Sample Content',
      justification: 'Sample Justification',
      status: 'Verified',
      type: 'SingleChoice',
      options: [
        { description: 'A', isCorrect: true, position: 1, questionId: 'q-1' },
        { description: 'B', isCorrect: false, position: 2, questionId: 'q-1' }
      ]
    } as Question);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate single choice question constraint', () => {
    component.optionsModel.set([
      { description: 'A', isCorrect: true, position: 1, questionId: 'q-1' },
      { description: 'B', isCorrect: true, position: 2, questionId: 'q-1' }
    ]);
    
    component.handleSubmitForm(new Event('submit'));
    expect(component.validationError()).toBe('A Single Choice question must have exactly 1 correct answer option.');
    expect(mockModalRef.close).not.toHaveBeenCalled();
  });

  it('should validate multiple choice question constraint', () => {
    component.questionModel.update(q => ({ ...q, type: 'MultipleChoice' }));
    
    component.optionsModel.set([
      { description: 'A', isCorrect: false, position: 1, questionId: 'q-1' },
      { description: 'B', isCorrect: false, position: 2, questionId: 'q-1' }
    ]);

    component.handleSubmitForm(new Event('submit'));
    expect(component.validationError()).toBe('A Multiple Choice question must have at least 1 correct answer option.');
    expect(mockModalRef.close).not.toHaveBeenCalled();
  });

  it('should allow submit if valid', () => {
    component.handleSubmitForm(new Event('submit'));
    expect(component.validationError()).toBeNull();
    expect(mockModalRef.close).toHaveBeenCalled();
  });
});
