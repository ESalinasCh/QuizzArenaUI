import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, from, of, switchMap } from 'rxjs';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { StudentQuizService } from '../../services/student-quiz.service';

@Component({
  selector: 'qz-student-exam-question-page',
  imports: [Icon],
  templateUrl: './exam-question-page.html',
})
export class StudentExamQuestionPage {
  readonly #router = inject(Router);
  readonly #studentQuizService = inject(StudentQuizService);

  readonly selectedOptionId = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  readonly questionIndex = signal(0);
  readonly optionLetters = ['A', 'B', 'C', 'D'];

  readonly exam = computed(() => this.#studentQuizService.getActiveExamStart());

  readonly currentQuestion = computed(() => this.exam()?.questions[this.questionIndex()]);
  readonly progressLabel = computed(() => {
    const current = this.questionIndex() + 1;
    const total = this.exam()?.questions.length ?? 0;

    return $localize`:Student exam question progress label:Question ${current}:current: of ${total}:total:`;
  });
  readonly progressPercentage = computed(() => {
    const total = this.exam()?.questions.length ?? 0;

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
    const attemptId = this.exam()?.attemptId;

    if (!selectedOptionId || !question || !attemptId || this.isSubmitting()) {
      return;
    }

    const total = this.exam()?.questions.length ?? 0;
    const nextIndex = this.questionIndex() + 1;
    const isLastQuestion = nextIndex >= total;

    this.isSubmitting.set(true);
    this.#studentQuizService
      .trackExamAnswer(attemptId, question.id, selectedOptionId)
      .pipe(
        switchMap(() => {
          if (!isLastQuestion) {
            return of<'next'>('next');
          }

          return this.#studentQuizService.completeExamAttempt(attemptId).pipe(
            switchMap(result =>
              from(this.#router.navigate(['/student/exams', result.attemptId, 'results'])),
            ),
          );
        }),
        catchError(() => {
          this.isSubmitting.set(false);

          return EMPTY;
        }),
      )
      .subscribe({
        next: result => {
          if (result === 'next') {
            this.questionIndex.set(nextIndex);
            this.selectedOptionId.set(null);
            this.isSubmitting.set(false);
            return;
          }

          if (!result) {
            this.isSubmitting.set(false);
          }
        },
      });
  }
}
