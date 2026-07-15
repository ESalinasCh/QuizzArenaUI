import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {  Router } from '@angular/router';
import { from, switchMap } from 'rxjs';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { SubmitMatchAttemptAnswerRequest } from '../../api/student-quiz.contract';
import { StudentQuizService } from '../../services/student-quiz.service';

@Component({
  selector: 'qz-student-quiz-question-page',
  imports: [Icon],
  templateUrl: './quiz-question-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentQuizQuestionPage {
  readonly #router = inject(Router);
  readonly #studentQuizService = inject(StudentQuizService);

  readonly selectedOptionId = signal<string | null>(null);
  readonly answers = signal<SubmitMatchAttemptAnswerRequest[]>([]);
  readonly isSubmitting = signal(false);
  readonly questionIndex = signal(0);
  readonly optionLetters = ['A', 'B', 'C', 'D'];

  readonly quiz = computed(() => this.#studentQuizService.getActiveQuizStart());

  readonly currentQuestion = computed(() => this.quiz()?.questions[this.questionIndex()]);
  readonly progressLabel = computed(() => {
    const current = this.questionIndex() + 1;
    const total = this.quiz()?.questions.length ?? 0;

    return $localize`:Student quiz question progress label:Question ${current}:current: of ${total}:total:`;
  });
  readonly progressPercentage = computed(() => {
    const total = this.quiz()?.questions.length ?? 0;

    if (!total) {
      return 0;
    }

    return ((this.questionIndex() + 1) / total) * 100;
  });

  selectOption(optionId: string): void {
    this.selectedOptionId.set(optionId);
  }

  confirmAnswer(): void {
    const selectedOptionId = this.selectedOptionId();
    const question = this.currentQuestion();

    if (!selectedOptionId || !question || this.isSubmitting()) {
      return;
    }

    this.#saveAnswer(question.id, selectedOptionId);

    const total = this.quiz()?.questions.length ?? 0;
    const nextIndex = this.questionIndex() + 1;

    if (nextIndex < total) {
      this.questionIndex.set(nextIndex);
      this.selectedOptionId.set(null);
      return;
    }

    const attemptId = this.quiz()?.attemptId;

    if (!attemptId) {
      return;
    }

    this.isSubmitting.set(true);
    this.#studentQuizService
      .submitMatchAttempt(attemptId, { answers: this.answers() })
      .pipe(
        switchMap(response =>
          from(
            this.#router.navigate([
              '/student/quizzes',
              response.attemptId,
              'results',
            ]),
          ),
        ),
      )
      .subscribe({
        next: navigated => {
          if (!navigated) {
            this.isSubmitting.set(false);
          }
        },
        error: () => {
          this.isSubmitting.set(false);
        },
      });
  }

  #saveAnswer(questionId: string, selectedOptionId: string): void {
    this.answers.update(answers => [
      ...answers.filter(answer => answer.questionId !== questionId),
      { questionId, selectedOptionId, answeredAt: new Date().toISOString() },
    ]);
  }
}
