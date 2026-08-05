import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { QuestionBankService } from '../../services/question-bank.service';
import { QuizResponseAsExams } from '../../api/teacher-exam.contract';
import { Button } from '../../../../shared/atoms/button/button';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { TextSpan } from '../../../../shared/atoms/text-span/text-span';
import { AdminQuestionCard } from '../../components/admin-question-card/admin-question-card';
import { NavigationHistoryService } from '../../../../core/services/navigation-history.service';
import { Badge } from '../../../../shared/atoms/badge/badge';
import { EmptyState } from '../../../../shared/molecules/empty-state/empty-state';

@Component({
  selector: 'qz-teacher-exam-questions-page',
  imports: [Button, Icon, TextSpan, AdminQuestionCard, Badge, EmptyState],
  templateUrl: './exam-questions-page.html',
})
export class TeacherExamQuestionsPage {
  readonly #navigationHistoryService = inject(NavigationHistoryService);
  readonly #questionBankService = inject(QuestionBankService);

  protected readonly backAriaLabel = $localize`:Exam questions page back button aria label:Back`;
  protected readonly noQuizDataTitle = $localize`:Exam questions missing data title:No exam selected`;
  protected readonly noQuizDataDescription = $localize`:Exam questions missing data description:Open this exam from the Exam Bank list to see its questions.`;
  protected readonly noQuestionsTitle = $localize`:Exam questions empty state title:No questions`;
  protected readonly noQuestionsDescription = $localize`:Exam questions empty state description:This exam doesn't have any questions yet.`;

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

  readonly questionsCountLabel = computed(() => {
    const count = this.questions().length;
    return $localize`:Exam questions count label:${count}:count: questions`;
  });

  goBack(): void {
    this.#navigationHistoryService.back('/teacher/exams/bank');
  }
}
