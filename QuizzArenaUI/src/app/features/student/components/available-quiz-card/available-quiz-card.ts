import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AvailableQuiz } from '../../models/student-quiz.model';

@Component({
  selector: 'app-available-quiz-card',
  standalone: true,
  templateUrl: './available-quiz-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailableQuizCard {
  quiz = input.required<AvailableQuiz>();
  startQuiz = output<string>();

  readonly statusLabel = computed(() =>
    this.quiz().status === 'available' ? 'Disponible' : 'Nuevo',
  );

  readonly statusClasses = computed(() =>
    this.quiz().status === 'available'
      ? 'text-success-text-light dark:text-success-text-dark'
      : 'text-primary',
  );

  emitStart(): void {
    this.startQuiz.emit(this.quiz().id);
  }
}
