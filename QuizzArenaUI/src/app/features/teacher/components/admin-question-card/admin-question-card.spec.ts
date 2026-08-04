import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalService } from '../../../../core/services/modal.service';
import { Question } from '../../models/question';
import { QuestionDeleteModal } from '../question-delete-modal/question-delete-modal';
import { QuestionEditModal } from '../question-add-edit-modal/question-add-edit-modal';
import { QuestionInfoModal } from '../question-info-modal/question-info-modal';
import { AdminQuestionCard } from './admin-question-card';

describe('AdminQuestionCard', () => {
  let fixture: ComponentFixture<AdminQuestionCard>;
  let modalService: { open: ReturnType<typeof vi.fn> };

  const question: Question = {
    ...new Question(),
    id: 'question-1',
    content: 'What is DDD?',
    status: 'Verified',
    type: 'SingleChoice',
  };

  beforeEach(() => {
    modalService = {
      open: vi.fn().mockReturnValue({ afterClosed: Promise.resolve(undefined) }),
    };

    TestBed.configureTestingModule({
      imports: [AdminQuestionCard],
      providers: [{ provide: ModalService, useValue: modalService }],
    });

    fixture = TestBed.createComponent(AdminQuestionCard);
    fixture.componentRef.setInput('question', question);
    fixture.detectChanges();
  });

  it('should render the Q1 badge when index is 0 (falsy but valid)', () => {
    fixture.componentRef.setInput('index', 0);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Q1');
  });

  it('should not render a question number badge when index is not provided', () => {
    expect(fixture.nativeElement.querySelector('app-badge')).toBeFalsy();
  });

  it('should render question content and metadata', () => {
    expect(fixture.nativeElement.textContent).toContain('What is DDD?');
    expect(fixture.nativeElement.textContent).toContain('Verified');
    expect(fixture.nativeElement.textContent).toContain('SingleChoice');
  });

  it('should open the information modal with the current question', () => {
    fixture.componentInstance.openInfoModal();

    expect(modalService.open).toHaveBeenCalledWith(
      QuestionInfoModal,
      { question },
      { title: 'Information' },
    );
  });

  it('should open edit modal using create title for new questions', () => {
    const newQuestion = { ...new Question(), id: '' };
    fixture.componentRef.setInput('question', newQuestion);

    fixture.componentInstance.openEditModal();

    expect(modalService.open).toHaveBeenCalledWith(
      QuestionEditModal,
      { question: newQuestion },
      { title: 'Create' },
    );
  });

  it('should emit edited question when edit modal closes with a value', async () => {
    const editedQuestion = { ...question, content: 'Updated question' };
    modalService.open.mockReturnValueOnce({ afterClosed: Promise.resolve(editedQuestion) });
    const emitSpy = vi.spyOn(fixture.componentInstance.newQuestion, 'emit');

    fixture.componentInstance.openEditModal();
    await Promise.resolve();

    expect(emitSpy).toHaveBeenCalledWith(editedQuestion);
  });

  it('should not emit edited question when edit modal closes empty', async () => {
    modalService.open.mockReturnValueOnce({ afterClosed: Promise.resolve(undefined) });
    const emitSpy = vi.spyOn(fixture.componentInstance.newQuestion, 'emit');

    fixture.componentInstance.openEditModal();
    await Promise.resolve();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit delete id when delete modal closes with an id', async () => {
    modalService.open.mockReturnValueOnce({ afterClosed: Promise.resolve('question-1') });
    const emitSpy = vi.spyOn(fixture.componentInstance.deleteQuestionById, 'emit');

    fixture.componentInstance.openDeleteModal();
    await Promise.resolve();

    expect(modalService.open).toHaveBeenCalledWith(
      QuestionDeleteModal,
      { question },
      { title: 'Delete' },
    );
    expect(emitSpy).toHaveBeenCalledWith('question-1');
  });

  it('should not emit delete id when delete modal closes empty', async () => {
    modalService.open.mockReturnValueOnce({ afterClosed: Promise.resolve(undefined) });
    const emitSpy = vi.spyOn(fixture.componentInstance.deleteQuestionById, 'emit');

    fixture.componentInstance.openDeleteModal();
    await Promise.resolve();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should toggle dropdown state', () => {
    fixture.componentInstance.handleToggleDropdown(true);

    expect(fixture.componentInstance.isDropdownOpened()).toBe(true);

    fixture.componentInstance.handleToggleDropdown(false);

    expect(fixture.componentInstance.isDropdownOpened()).toBe(false);
  });

  it('should render each option and highlight the correct one', () => {
    fixture.componentRef.setInput('question', {
      ...question,
      options: [
        { id: 'opt-1', description: 'Paris', isCorrect: true, position: 0, questionId: 'question-1' },
        { id: 'opt-2', description: 'Madrid', isCorrect: false, position: 1, questionId: 'question-1' },
      ],
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Paris');
    expect(fixture.nativeElement.textContent).toContain('Madrid');

    const spans: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('span'));
    const correctSpan = spans.find(s => s.textContent?.trim() === 'Paris');
    const wrongSpan = spans.find(s => s.textContent?.trim() === 'Madrid');
    expect(correctSpan?.className).toContain('text-green-700');
    expect(wrongSpan?.className).not.toContain('text-green-700');
  });

  it('should not render an options section when the question has no options', () => {
    fixture.componentRef.setInput('question', { ...question, options: [] });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.border-t')).toBeFalsy();
  });

  it('should show edit and delete actions by default (not read-only)', () => {
    const buttons = fixture.nativeElement.querySelectorAll('qz-button');
    expect(buttons.length).toBe(3);
  });

  it('should hide edit and delete actions but keep info when readOnly is true', () => {
    fixture.componentRef.setInput('readOnly', true);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('qz-button');
    expect(buttons.length).toBe(1);
  });

  it('should update width on resize', () => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(500);

    fixture.componentInstance.onResize();

    expect(fixture.componentInstance.width()).toBe(500);
    expect(fixture.componentInstance.isMobile()).toBe(true);
  });
});
