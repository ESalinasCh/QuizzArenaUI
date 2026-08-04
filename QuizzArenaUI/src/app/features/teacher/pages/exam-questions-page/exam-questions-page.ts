import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { QuestionBankService } from '../../services/question-bank.service';
import { QuizResponseAsExams } from '../../api/teacher-exam.contract';
import { Button } from '../../../../shared/atoms/button/button';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { ItemContainer } from '../../../../shared/atoms/item-container/item-container';
import { TextSpan } from '../../../../shared/atoms/text-span/text-span';
import { AdminQuestionCard } from '../../components/admin-question-card/admin-question-card';
import { NavigationHistoryService } from '../../../../core/services/navigation-history.service';

@Component({
  selector: 'qz-teacher-exam-questions-page',
  imports: [Button, Icon, ItemContainer, TextSpan, AdminQuestionCard],
  templateUrl: './exam-questions-page.html',
})
export class TeacherExamQuestionsPage {
  readonly #navigationHistoryService = inject(NavigationHistoryService);
  readonly #questionBankService = inject(QuestionBankService);

  protected readonly backAriaLabel = $localize`:Exam questions page back button aria label:Back`;

  readonly quiz = signal<QuizResponseAsExams | undefined>(history.state?.['quiz']);

  readonly noQuizData = computed(() => !this.quiz());

  readonly questionsResource = rxResource({
    params: () => {
      const questionIds = this.quiz()?.questions.map(q => q.questionId) ?? [];
      return questionIds.length > 0 ? { questionIds } : undefined;
    },
    stream: ({ params }) =>
      this.#questionBankService.getQuestions({
        questionIds: params.questionIds,
        pageSize: params.questionIds.length,
        status: 'Verified',
      }),
  });

  readonly questions = computed(() => this.questionsResource.value() ?? []);
  readonly isLoadingQuestions = computed(() => this.questionsResource.isLoading());

  goBack(): void {
    this.#navigationHistoryService.back('/teacher/exams/bank');
  }
}
