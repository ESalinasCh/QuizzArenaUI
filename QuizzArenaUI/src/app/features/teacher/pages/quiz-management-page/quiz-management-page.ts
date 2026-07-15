import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, OnInit, signal } from '@angular/core';
import { InputTextClearOption, TextInput } from "../../../../shared/molecules/text-input/text-input";
import { Icon } from "../../../../shared/atoms/icon/icon";
import { Button } from "../../../../shared/atoms/button/button";
import { form, FormField } from '@angular/forms/signals';
import { QuestionFilterModal } from "../../components/question-filter-modal/question-filter-modal";
import { QuizManagementService } from '../../services/quiz-management.service';
import { map, take, tap } from 'rxjs';
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
  selector: 'qz-teacher-quiz-management-page',
  templateUrl: './quiz-management-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextInput, AdminQuestionCard, Icon, Button, FormField, TextSpan],
})
export class TeacherQuizManagementPage implements OnInit {
  readonly #modalService = inject(ModalService);
  readonly #avRoute = inject(ActivatedRoute);

  readonly #quizManagementService = inject(QuizManagementService);
  readonly processingJobsId = signal(this.#avRoute.snapshot.params['processing-job-id'])

  readonly page = signal(0);
  readonly searchModel = signal(structuredClone(searchDefaultForm));
  readonly searchForm = form(this.searchModel);
  readonly questionFilterModel = signal<QuestionFilter>(new QuestionFilter());

  readonly questions = signal<Question[]>([]);

  readonly isFilterActive = computed(() => {
    const filter = this.questionFilterModel();
    return Object.values(filter.status).some(v => v) || Object.values(filter.types).some(v => v);
  });

  readonly clearOptions = linkedSignal<InputTextClearOption>(() => ({
    isActivated: !!this.searchModel().names,
    text: this.searchModel().names ? 'Clear Text' : undefined,
  }));

  ngOnInit(): void {
    this.getMoreQuestions();
  }

  getMoreQuestions(): void {
    this.#quizManagementService.getQuestions({
      page: 1,
      pageSize: 5,
      processingJobsIds: [this.processingJobsId()],
      status: 'Verified',
    }).pipe(take(1), map((res) => { console.log(res); return res })).subscribe({
      next: (response) => {
        this.questions.update(quizzes => [...quizzes, ...response]);
      },
      error: () => {
        console.error('Error fetching questions');
      }
    });
  }

  cleanQuestions(): void {
    this.questions.set([]);
    this.page.set(0);
    this.getMoreQuestions();
  }

  handleNewFilter(questionFilter: QuestionFilter): void {
    this.questionFilterModel.set(questionFilter);
  }

  handleNewQuestion(question: Question): void {
    this.questions.update(questionCollection =>
      questionCollection.map(quest => quest.id === question.id ? question : quest)
    );
  }

  handleDeleteQuestion(id: string): void {
    this.questions.update(questionCollection =>
      questionCollection.filter(quest => quest.id !== id)
    );
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
}
