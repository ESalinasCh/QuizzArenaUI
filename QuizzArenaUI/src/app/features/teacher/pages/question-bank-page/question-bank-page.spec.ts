import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ModalService } from '../../../../core/services/modal.service';
import { QuestionFilterModal } from '../../components/question-filter-modal/question-filter-modal';
import { Question } from '../../models/question';
import { QuestionFilter } from '../../models/question-form-filter';
import { QuestionBankService } from '../../services/question-bank.service';
import { TeacherQuestionBankPage } from './question-bank-page';

describe('TeacherQuestionBankPage', () => {
  let fixture: ComponentFixture<TeacherQuestionBankPage>;
  let questionBankService: {
    getQuestions: ReturnType<typeof vi.fn>;
    updateQuestion: ReturnType<typeof vi.fn>;
    deleteQuestion: ReturnType<typeof vi.fn>;
  };
  let modalService: { open: ReturnType<typeof vi.fn> };

  const questionA = createQuestion({
    id: 'question-a',
    content: 'What is DDD?',
    justification: 'Domain Driven Design',
  });
  const questionB = createQuestion({
    id: 'question-b',
    content: 'What is Angular?',
    justification: 'Frontend framework',
  });

  beforeEach(async () => {
    questionBankService = {
      getQuestions: vi.fn().mockReturnValue(of([questionA, questionB])),
      updateQuestion: vi.fn().mockReturnValue(of({})),
      deleteQuestion: vi.fn().mockReturnValue(of({})),
    };
    modalService = {
      open: vi.fn().mockReturnValue({ afterClosed: Promise.resolve(undefined) }),
    };

    await TestBed.configureTestingModule({
      imports: [TeacherQuestionBankPage],
      providers: [
        { provide: QuestionBankService, useValue: questionBankService },
        { provide: ModalService, useValue: modalService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { 'processing-job-id': 'job-1' } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherQuestionBankPage);
  });

  it('should load first page of questions on init', () => {
    fixture.detectChanges();

    expect(questionBankService.getQuestions).toHaveBeenCalledWith({
      page: 1,
      pageSize: 5,
      processingJobsIds: ['job-1'],
      status: 'Verified',
    });
    expect(fixture.componentInstance.questions()).toEqual([questionA, questionB]);
    expect(fixture.componentInstance.page()).toBe(1);
    expect(fixture.componentInstance.isLoading()).toBe(false);
  });

  it('should mark hasMore as false when fewer than five questions are loaded', () => {
    questionBankService.getQuestions.mockReturnValueOnce(of([questionA]));

    fixture.detectChanges();

    expect(fixture.componentInstance.hasMore()).toBe(false);
  });

  it('should not load more questions while already loading', () => {
    fixture.componentInstance.isLoading.set(true);

    fixture.componentInstance.getMoreQuestions();

    expect(questionBankService.getQuestions).not.toHaveBeenCalled();
  });

  it('should not load more questions when there are no more results', () => {
    fixture.componentInstance.hasMore.set(false);

    fixture.componentInstance.getMoreQuestions();

    expect(questionBankService.getQuestions).not.toHaveBeenCalled();
  });

  it('should reset state and fetch questions when cleaning questions', () => {
    fixture.detectChanges();
    questionBankService.getQuestions.mockClear();
    fixture.componentInstance.page.set(3);
    fixture.componentInstance.questions.set([questionA]);
    fixture.componentInstance.hasMore.set(false);

    fixture.componentInstance.cleanQuestions();

    expect(fixture.componentInstance.page()).toBe(1);
    expect(fixture.componentInstance.hasMore()).toBe(false);
    expect(questionBankService.getQuestions).toHaveBeenCalledOnce();
  });

  it('should update question filters', () => {
    const filter = new QuestionFilter();
    filter.status.Draft = true;

    fixture.componentInstance.handleNewFilter(filter);

    expect(fixture.componentInstance.questionFilterModel()).toBe(filter);
  });

  it('should update a question and merge options by position', () => {
    const updatedQuestion = createQuestion({
      id: 'question-a',
      content: 'Updated question',
      options: [
        { id: 'option-1', description: 'Updated option', isCorrect: true, position: 1, questionId: 'question-a' },
        { id: 'option-2', description: 'New option', isCorrect: false, position: 2, questionId: 'question-a' },
      ],
    });
    fixture.componentInstance.questions.set([
      createQuestion({
        id: 'question-a',
        content: 'Old question',
        options: [
          { id: 'option-1', description: 'Old option', isCorrect: false, position: 1, questionId: 'question-a' },
        ],
      }),
    ]);

    fixture.componentInstance.handleNewQuestion(updatedQuestion);

    expect(questionBankService.updateQuestion).toHaveBeenCalledWith('question-a', updatedQuestion);
    expect(fixture.componentInstance.questions()[0].content).toBe('Updated question');
    expect(fixture.componentInstance.questions()[0].options?.length).toBe(2);
    expect(fixture.componentInstance.questions()[0].options?.[0].description).toBe('Updated option');
  });

  it('should keep questions unchanged when update fails', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    questionBankService.updateQuestion.mockReturnValueOnce(throwError(() => new Error('Update failed')));
    fixture.componentInstance.questions.set([questionA]);

    fixture.componentInstance.handleNewQuestion({ ...questionA, content: 'Updated question' });

    expect(fixture.componentInstance.questions()).toEqual([questionA]);
    expect(consoleSpy).toHaveBeenCalledWith('Error updating question', expect.any(Error));
  });

  it('should delete a question from the collection', () => {
    fixture.componentInstance.questions.set([questionA, questionB]);

    fixture.componentInstance.handleDeleteQuestion('question-a');

    expect(questionBankService.deleteQuestion).toHaveBeenCalledWith('question-a');
    expect(fixture.componentInstance.questions()).toEqual([questionB]);
  });

  it('should keep questions unchanged when delete fails', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    questionBankService.deleteQuestion.mockReturnValueOnce(throwError(() => new Error('Delete failed')));
    fixture.componentInstance.questions.set([questionA]);

    fixture.componentInstance.handleDeleteQuestion('question-a');

    expect(fixture.componentInstance.questions()).toEqual([questionA]);
    expect(consoleSpy).toHaveBeenCalledWith('Error deleting question', expect.any(Error));
  });

  it('should clear search state and reload questions', () => {
    fixture.detectChanges();
    questionBankService.getQuestions.mockClear();
    fixture.componentInstance.searchModel.set({ names: 'Angular' });
    fixture.componentInstance.clearOptions.set({ isActivated: true, text: 'Clear Text' });

    fixture.componentInstance.handleClearClick();

    expect(fixture.componentInstance.searchModel()).toEqual({ names: '' });
    expect(fixture.componentInstance.clearOptions()).toEqual({ isActivated: false });
    expect(questionBankService.getQuestions).toHaveBeenCalledOnce();
  });

  it('should open filter modal and apply returned filters', async () => {
    const filter = new QuestionFilter();
    filter.types.MultipleChoice = true;
    const initialFilter = fixture.componentInstance.questionFilterModel();
    modalService.open.mockReturnValueOnce({ afterClosed: Promise.resolve(filter) });

    fixture.componentInstance.openFilterModal();
    await Promise.resolve();

    expect(modalService.open).toHaveBeenCalledWith(
      QuestionFilterModal,
      { questionFilter: initialFilter },
      { title: 'Filters' },
    );
    expect(fixture.componentInstance.questionFilterModel()).toBe(filter);
  });

  it('should not apply filters when filter modal closes empty', async () => {
    const initialFilter = fixture.componentInstance.questionFilterModel();
    modalService.open.mockReturnValueOnce({ afterClosed: Promise.resolve(undefined) });

    fixture.componentInstance.openFilterModal();
    await Promise.resolve();

    expect(fixture.componentInstance.questionFilterModel()).toBe(initialFilter);
  });

  it('should filter questions by content or justification', () => {
    fixture.componentInstance.questions.set([questionA, questionB]);

    expect(fixture.componentInstance.mockTextFilter('angular')).toEqual([questionB]);
    expect(fixture.componentInstance.mockTextFilter('domain')).toEqual([questionA]);
    expect(fixture.componentInstance.mockTextFilter('')).toEqual([questionA, questionB]);
  });
});

function createQuestion(overrides: Partial<Question> = {}): Question {
  return {
    ...new Question(),
    ...overrides,
  };
}
