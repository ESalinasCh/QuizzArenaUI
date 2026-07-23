import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, from, switchMap } from 'rxjs';
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

  readonly selectedOptionIds = signal<string[]>([]);
  readonly answers = signal<SubmitMatchAttemptAnswerRequest[]>([]);
  readonly isSubmitting = signal(false);
  readonly questionIndex = signal(0);
  readonly optionLetters = ['A', 'B', 'C', 'D'];

  readonly quiz = computed(() => this.#studentQuizService.getActiveQuizStart());

  readonly currentQuestion = computed(() => this.quiz()?.questions[this.questionIndex()]);
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

    if (!selectedOptionIds.length || !question || this.isSubmitting()) {
      return;
    }

    this.#saveAnswer(question.id, selectedOptionIds);

    const total = this.quiz()?.questions.length ?? 0;
    const nextIndex = this.questionIndex() + 1;

    if (nextIndex < total) {
      this.questionIndex.set(nextIndex);
      this.selectedOptionIds.set([]);
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
        catchError(() => {
          this.isSubmitting.set(false);

          return EMPTY;
        }),
      )
      .subscribe({
        next: navigated => {
          if (!navigated) {
            this.isSubmitting.set(false);
          }
        },
      });
  }

  #saveAnswer(questionId: string, selectedOptionIds: string[]): void {
    this.answers.update(answers => [
      ...answers.filter(answer => answer.questionId !== questionId),
      { questionId, selectedOptionIds, answeredAt: new Date().toISOString() },
    ]);
  }
}
