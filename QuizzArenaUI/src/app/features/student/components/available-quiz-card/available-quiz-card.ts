import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { StatusLabelVariant } from '../../../../shared/atoms/status-label/status-label';
import { QuizCardMeta } from '../../../../shared/molecules/quiz-card-meta/quiz-card-meta';
import { QuizCard } from '../../../../shared/organisms/quiz-card/quiz-card';
import { AvailableQuiz } from '../../models/student-quiz.model';
@Component({
  selector: 'qz-available-quiz-card',
  imports: [QuizCard, QuizCardMeta],
  templateUrl: './available-quiz-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailableQuizCard {
  quiz = input.required<AvailableQuiz>();
  startQuiz = output<string>();

  readonly statusLabel = computed(() =>
    this.quiz().status === 'available' ? 'Disponible' : 'Nuevo',
  );

  readonly statusVariant = computed<StatusLabelVariant>(() =>
    this.quiz().status === 'available' ? 'success' : 'info',
  );

  emitStart(): void {
    this.startQuiz.emit(this.quiz().id);
  }
}
