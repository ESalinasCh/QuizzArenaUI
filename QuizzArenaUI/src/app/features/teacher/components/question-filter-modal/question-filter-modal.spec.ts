import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalRef } from '../../../../core/services/modal.service';
import { QUESTION_STATUS_RESPONSE } from '../../mocks/questionStatusResponse.mock';
import { TYPE_OPTIONS_MOCK } from '../../mocks/typeQuestionOptions.mock';
import { QuestionFilter } from '../../models/question-form-filter';
import { QuestionFilterModal } from './question-filter-modal';

describe('QuestionFilterModal', () => {
  let fixture: ComponentFixture<QuestionFilterModal>;
  let modalRef: { close: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    modalRef = {
      close: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [QuestionFilterModal],
      providers: [{ provide: ModalRef, useValue: modalRef }],
    });

    fixture = TestBed.createComponent(QuestionFilterModal);
    fixture.componentRef.setInput('questionFilter', new QuestionFilter());
    fixture.detectChanges();
  });

  it('should load status and type options on init', () => {
    expect(fixture.componentInstance.statusOptions()).toEqual(QUESTION_STATUS_RESPONSE);
    expect(fixture.componentInstance.typeOptions()).toEqual(TYPE_OPTIONS_MOCK);
  });

  it('should render filter sections and actions', () => {
    const textContent = fixture.nativeElement.textContent;

    expect(textContent).toContain('State');
    expect(textContent).toContain('Type');
    expect(textContent).toContain('Clean');
    expect(textContent).toContain('Apply FIlters');
  });

  it('should close with current filters when the form is submitted', () => {
    const filter = new QuestionFilter();
    filter.status.Verified = true;
    filter.types.SingleChoice = true;
    fixture.componentRef.setInput('questionFilter', filter);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));

    expect(modalRef.close).toHaveBeenCalledWith(filter);
  });

  it('should close with clean filters when clean action is clicked', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');

    buttons[0].click();

    expect(modalRef.close).toHaveBeenCalledWith(new QuestionFilter());
  });
});
