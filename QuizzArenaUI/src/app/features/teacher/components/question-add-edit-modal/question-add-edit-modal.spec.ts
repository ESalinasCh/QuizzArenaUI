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

  it('should close without result when canceling', () => {
    component.handleCancelButton();

    expect(mockModalRef.close).toHaveBeenCalledWith(undefined);
  });

  it('should close without result from close handler', () => {
    component.handleCloseModal();

    expect(mockModalRef.close).toHaveBeenCalledWith(undefined);
  });

  it('should add a new editable option', () => {
    component.handleAddOption();

    expect(component.optionsModel()).toContainEqual({
      description: '',
      isCorrect: false,
      position: 3,
      questionId: 'q-1'
    });
    expect(component.editingOptionPosition()).toBe(3);
  });

  it('should start editing an option', () => {
    component.startEditingOption({ description: 'A', isCorrect: true, position: 1, questionId: 'q-1' });

    expect(component.editingOptionPosition()).toBe(1);
  });

  it('should save option description and stop editing', () => {
    const option = { description: 'A', isCorrect: true, position: 1, questionId: 'q-1' };

    component.startEditingOption(option);
    component.saveOptionDescription(option, 'Updated answer');

    expect(component.optionsModel()[0].description).toBe('Updated answer');
    expect(component.editingOptionPosition()).toBeNull();
  });

  it('should toggle selected option correct status and clear validation error', () => {
    component.validationError.set('Previous error');

    component.handleChangeCorrectAnswer({ description: 'B', isCorrect: false, position: 2, questionId: 'q-1' });

    expect(component.validationError()).toBeNull();
    expect(component.optionsModel()[1].isCorrect).toBe(true);
  });

  it('should submit created question with options', () => {
    fixture.componentRef.setInput('question', {
      ...new Question(),
      content: 'New question',
      type: 'SingleChoice',
      options: [
        { description: 'A', isCorrect: true, position: 1, questionId: '' },
      ]
    } as Question);
    fixture.detectChanges();

    component.handleSubmitForm(new Event('submit'));

    expect(mockModalRef.close).toHaveBeenCalledWith(expect.objectContaining({
      content: 'New question',
      options: [
        { description: 'A', isCorrect: true, position: 1, questionId: '' },
      ]
    }));
  });
});
