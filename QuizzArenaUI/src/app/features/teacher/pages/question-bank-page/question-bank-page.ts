import { Component, computed, inject, linkedSignal, OnInit, signal } from '@angular/core';
import { InputTextClearOption, TextInput } from "../../../../shared/molecules/text-input/text-input";
import { Icon } from "../../../../shared/atoms/icon/icon";
import { Button } from "../../../../shared/atoms/button/button";
import { form, FormField } from '@angular/forms/signals';
import { QuestionFilterModal } from "../../components/question-filter-modal/question-filter-modal";
import { QuestionBankService } from '../../services/question-bank.service';
import { finalize, map, take } from 'rxjs';
import { TextSpan } from "../../../../shared/atoms/text-span/text-span";
import { AdminQuestionCard } from '../../components/admin-question-card/admin-question-card';
import { Question } from '../../models/question';
import { QuestionFilter } from '../../models/question-form-filter';
import { ModalService } from '../../../../core/services/modal.service';
import { ActivatedRoute } from '@angular/router';

const defaultClearOptions: InputTextClearOption = {
  isActivated: false,
}
const searchDefaultForm = { names: '' }

@Component({
  selector: 'qz-teacher-question-bank-page',
  templateUrl: './question-bank-page.html',

  imports: [TextInput, AdminQuestionCard, Icon, Button, FormField, TextSpan],
})
export class TeacherQuestionBankPage implements OnInit {
  readonly #modalService = inject(ModalService);
  readonly #avRoute = inject(ActivatedRoute);

  readonly #questionBankService = inject(QuestionBankService);
  readonly processingJobsId = signal(this.#avRoute.snapshot.params['processing-job-id'])

  readonly page = signal(0);
  readonly searchModel = signal(structuredClone(searchDefaultForm));
  readonly searchForm = form(this.searchModel);
  readonly questionDefaultFilter = signal<QuestionFilter>(
    { status: { Verified: true, Disapproved: false, Draft: false }, types: { MultipleChoice: true, SingleChoice: true } }
  );
  readonly questionFilterModel = signal<QuestionFilter>(structuredClone(this.questionDefaultFilter()));

  readonly questions = signal<Question[]>([]);
  readonly isLoading = signal(false);
  readonly hasMore = signal(true);

  readonly isFilterActive = computed(() => {
    const filter = this.questionFilterModel();
    return Object.values(filter.status).some(v => v) || Object.values(filter.types).some(v => v);
  });

  readonly filteredQuestions = computed(() => {
    return this.mockTextFilter(this.searchModel().names);
  });

  readonly clearOptions = linkedSignal<InputTextClearOption>(() => ({
    isActivated: !!this.searchModel().names,
    text: this.searchModel().names ? 'Clear Text' : undefined,
  }));

  ngOnInit(): void {
    this.getMoreQuestions();
  }

  getMoreQuestions(): void {
    if (this.isLoading() || !this.hasMore()) {
      return;
    }

    this.isLoading.set(true);
    const nextPage = this.page() + 1;

    this.#questionBankService.getQuestions({
      page: nextPage,
      pageSize: 5,
      processingJobsIds: [this.processingJobsId()],
      status: "Verified",
    }).pipe(
      take(1),
      map((res) => res),
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (response) => {
        this.page.set(nextPage);
        this.questions.update(quizzes => [...quizzes, ...response]);
        if (response.length < 5) {
          this.hasMore.set(false);
        }
      },
      error: () => {
        console.error('Error fetching questions');
      }
    });
  }

  cleanQuestions(): void {
    this.questions.set([]);
    this.page.set(0);
    this.hasMore.set(true);
    this.getMoreQuestions();
  }

  handleNewFilter(questionFilter: QuestionFilter): void {
    this.questionFilterModel.set(questionFilter);
  }

  handleNewQuestion(question: Question): void {
    this.#questionBankService.updateQuestion(question.id, question).pipe(
      take(1)
    ).subscribe({
      next: () => {
        this.questions.update(questionCollection =>
          questionCollection.map(quest => {
            if (quest.id === question.id) {
              const updatedOptions = quest.options?.map(origOpt => {
                const deltaOpt = question.options?.find(d => d.position === origOpt.position);
                return deltaOpt ? { ...origOpt, ...deltaOpt } : origOpt;
              }) || [];

              const newOptions = question.options?.filter(d =>
                !updatedOptions.some(u => u.position === d.position)
              ) || [];

              const finalOptions = [...updatedOptions, ...newOptions].sort((a, b) => a.position - b.position);

              return {
                ...quest,
                ...question,
                options: finalOptions
              } as Question;
            }
            return quest;
          })
        );
      },
      error: (err) => {
        console.error('Error updating question', err);
      }
    });
  }

  handleDeleteQuestion(id: string): void {
    this.#questionBankService.deleteQuestion(id).pipe(
      take(1)
    ).subscribe({
      next: () => {
        this.questions.update(questionCollection =>
          questionCollection.filter(quest => quest.id !== id)
        );
      },
      error: (err) => {
        console.error('Error deleting question', err);
      }
    });
  }

  handleClearClick(): void {
    this.cleanQuestions();
    this.clearOptions.set(structuredClone(defaultClearOptions));
    this.searchModel.set(structuredClone(searchDefaultForm));
  }

  openFilterModal(): void {
    const ref = this.#modalService.open<QuestionFilterModal, QuestionFilter>(
      QuestionFilterModal,
      { questionFilter: this.questionFilterModel() },
      { title: 'Filters' }
    );
    ref.afterClosed.then((filter) => {
      if (filter) {
        this.handleNewFilter(filter);
      }
    });
  }

  mockTextFilter(text: string): Question[] {
    const searchText = text.toLowerCase().trim();
    if (!searchText) {
      return this.questions();
    }
    return this.questions().filter(q =>
      q.content.toLowerCase().includes(searchText) ||
      q.justification?.toLowerCase().includes(searchText)
    );
  }
}
