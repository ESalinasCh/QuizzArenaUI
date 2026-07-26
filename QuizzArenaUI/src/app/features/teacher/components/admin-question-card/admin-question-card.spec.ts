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

  it('should update width on resize', () => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(500);

    fixture.componentInstance.onResize();

    expect(fixture.componentInstance.width()).toBe(500);
    expect(fixture.componentInstance.isMobile()).toBe(true);
  });
});
