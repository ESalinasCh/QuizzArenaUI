import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, OnInit, signal } from '@angular/core';
import { InputTextClearOption, TextInput } from "../../../../shared/molecules/text-input/text-input";
import { Icon } from "../../../../shared/atoms/icon/icon";
import { Button } from "../../../../shared/atoms/button/button";
import { form, FormField } from '@angular/forms/signals';
import { QuestionFilterModal } from "../../components/question-filter-modal/question-filter-modal";
import { QuizManagementService } from '../../services/quiz-management.service';
import { take } from 'rxjs';
import { TextSpan } from "../../../../shared/atoms/text-span/text-span";
import { AdminQuestionCard } from '../../components/admin-question-card/admin-question-card';
import { Question } from '../../models/question';
import { QuestionFilter } from '../../models/question-form-filter';
import { ModalService } from '../../../../core/services/modal.service';


const defaultClearOptions: InputTextClearOption = {
  isActivated: false,
}
const activatedClearOptions: InputTextClearOption = {
  isActivated: true,
  text: 'Clear Text',
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
  private quizManagementService = inject(QuizManagementService);
  page = signal(0);

  searchModel = signal(structuredClone(searchDefaultForm));
  searchForm = form(this.searchModel);

  questionFilterModel = signal<QuestionFilter>(new QuestionFilter());

  isFilterActive = computed(() => {
    if (JSON.stringify(this.questionFilterModel()) === JSON.stringify(new QuestionFilter())) {
      return false;
    }
    return true;
  });

  initialQuestion = signal<Question[]>([]);
  foundQuestions = computed<Question[]>(() => {
    const searchText = this.searchModel().names;
    if (!searchText) return [];
    return this.initialQuestion().filter(quiz => {
      const doesIncludeText = quiz.content.toLowerCase().includes(searchText.toLowerCase());
      return doesIncludeText;
    });
  });
  showFoundQuestions = computed(() => {
    if (this.foundQuestions().length > 0) return true;
    if (this.searchModel().names) return true;
    if (this.isFilterActive()) return true;
    return false;
  });
  questionsToShow = computed(() => {
    return this.showFoundQuestions() ? this.foundQuestions() : this.initialQuestion();
  })

  clearOptions = linkedSignal(() => {
    const searchText = this.searchModel().names;
    if (searchText == '') return structuredClone(defaultClearOptions)
    return structuredClone(activatedClearOptions);
  });

  ngOnInit(): void {
    this.getMoreQuestions();
  }

  getMoreQuestions() {
    this.quizManagementService.getQuestions().pipe(take(1)).subscribe({
      next: (response) => {
        this.initialQuestion.update(quizzes => [...quizzes, ...response]);
      },
      error: () => {
        console.error('Error');
      }
    });
  }

  cleanQuestions() {
    this.initialQuestion.set([]);
    this.page.set(0);
    this.getMoreQuestions();
  }



  handleNewFilter(questionFilter: QuestionFilter) {
    this.questionFilterModel.set(questionFilter);
  }

  handleNewQuestion(question: Question) {
    this.initialQuestion.update(questionCollection =>
      questionCollection.map(quest => {
        return quest.id == question.id ? question : quest
      })
    )
  }

  handleDeleteQuestion(id: string) {
    this.initialQuestion.update(questionCollection =>
      questionCollection.filter(quest => quest.id != id)
    )
  }

  handleClearClick() {
    this.cleanQuestions();
    this.clearOptions.set(structuredClone(defaultClearOptions));
    this.searchModel.set(structuredClone(searchDefaultForm));
  }

  openFilterModal() {
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
