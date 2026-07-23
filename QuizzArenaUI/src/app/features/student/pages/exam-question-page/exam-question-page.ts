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

  readonly selectedOptionIds = signal<string[]>([]);
  readonly isSubmitting = signal(false);
  readonly questionIndex = signal(0);
  readonly optionLetters = ['A', 'B', 'C', 'D'];

  readonly exam = computed(() => this.#studentQuizService.getActiveExamStart());

  readonly currentQuestion = computed(() => this.exam()?.questions[this.questionIndex()]);
  readonly selectionInstruction = computed(() => {
    const questionType = this.currentQuestion()?.questionType;

    if (questionType === 'MultipleChoice') {
      return $localize`:Student multiple choice instruction:Select all correct answers`;
    }

    if (questionType === 'TrueFalse') {
      return $localize`:Student true false instruction:Mark true or false`;
    }

    return $localize`:Student single choice instruction:Select one answer`;
  });
  readonly hasSelection = computed(() => this.selectedOptionIds().length > 0);
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

  isOptionSelected(optionId: string): boolean {
    return this.selectedOptionIds().includes(optionId);
  }

  selectOption(optionId: string): void {
    if (this.currentQuestion()?.questionType !== 'MultipleChoice') {
      this.selectedOptionIds.set([optionId]);
      return;
    }

    this.selectedOptionIds.update(selectedOptionIds =>
      selectedOptionIds.includes(optionId)
        ? selectedOptionIds.filter(selectedOptionId => selectedOptionId !== optionId)
        : [...selectedOptionIds, optionId],
    );
  }

  confirmAnswer(): void {
    const selectedOptionIds = this.selectedOptionIds();
    const question = this.currentQuestion();
    const attemptId = this.exam()?.attemptId;

    if (!selectedOptionIds.length || !question || !attemptId || this.isSubmitting()) {
      return;
    }

    const total = this.exam()?.questions.length ?? 0;
    const nextIndex = this.questionIndex() + 1;
    const isLastQuestion = nextIndex >= total;

    this.isSubmitting.set(true);
    this.#studentQuizService
      .trackExamAnswer(attemptId, question.id, selectedOptionIds)
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
            this.selectedOptionIds.set([]);
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
