import { Component, computed, input, output } from '@angular/core';
import { StatusLabelVariant } from '../../../../shared/atoms/status-label/status-label';
import { QuizCardMeta, QuizCardMetaItem } from '../../../../shared/molecules/quiz-card-meta/quiz-card-meta';
import { QuizCard } from '../../../../shared/organisms/quiz-card/quiz-card';
import { AvailableQuiz } from '../../models/student-quiz.model';

const LAST_ATTEMPT_WARNING_THRESHOLD = 1;
const UNLIMITED_ATTEMPTS_SYMBOL = '∞';

@Component({
  selector: 'qz-available-quiz-card',
  imports: [QuizCard, QuizCardMeta],
  templateUrl: './available-quiz-card.html',
  styleUrl: './available-quiz-card.css',
})
export class AvailableQuizCard {
  quiz = input.required<AvailableQuiz>();
  startQuiz = output<string>();

  readonly startActionLabel = $localize`:Available quiz card start action:Start`;
  readonly questionsLabel = $localize`:Available quiz questions meta label:Questions`;
  readonly statusMetaLabel = $localize`:Available quiz status meta label:Status`;
  readonly attemptsLeftMetaLabel = $localize`:Available quiz attempts left meta label:Attempts left`;

  readonly attemptsLeft = computed(() =>
    Math.max(0, this.quiz().attemptsAmount - this.quiz().attemptsUsed),
  );

  readonly metaItems = computed<QuizCardMetaItem[]>(() => [
    {
      label: this.questionsLabel,
      value: `${this.quiz().questionCount}`,
      icon: 'quiz',
    },
    {
      label: this.statusMetaLabel,
      value: this.#statusValue(),
      variant: this.quiz().hasActiveAttempt ? 'warning' : 'success',
    },
    {
      label: this.attemptsLeftMetaLabel,
      value: this.#attemptsLeftValue(),
      variant: this.#attemptsLeftVariant(),
    },
  ]);

  readonly isStartDisabled = computed(
    () =>
      (this.#hasUnlimitedAttempts() && this.quiz().hasActiveAttempt) ||
      (!this.#hasUnlimitedAttempts() && this.attemptsLeft() === 0),
  );

  emitStart(): void {
    if (this.isStartDisabled()) {
      return;
    }

    this.startQuiz.emit(this.quiz().id);
  }

  #statusValue(): string {
    return this.quiz().hasActiveAttempt
      ? $localize`:Available quiz active attempt status:In progress`
      : $localize`:Available quiz ready status:Available`;
  }

  #attemptsLeftValue(): string {
    return this.#hasUnlimitedAttempts() ? UNLIMITED_ATTEMPTS_SYMBOL : `${this.attemptsLeft()}`;
  }

  #attemptsLeftVariant(): StatusLabelVariant {
    if (this.#hasUnlimitedAttempts()) {
      return 'success';
    }

    const attemptsLeft = this.attemptsLeft();

    if (attemptsLeft === 0) {
      return 'danger';
    }

    return attemptsLeft === LAST_ATTEMPT_WARNING_THRESHOLD ? 'warning' : 'success';
  }

  #hasUnlimitedAttempts(): boolean {
    return this.quiz().mode === 'Solo';
  }
}
