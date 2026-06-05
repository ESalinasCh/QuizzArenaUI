import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { RecentQuiz } from '../../models/student-quiz.model';

@Component({
  selector: 'app-recent-quiz-card',
  standalone: true,
  imports: [Icon],
  templateUrl: './recent-quiz-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentQuizCard {
  quiz = input.required<RecentQuiz>();
  viewResults = output<string>();

  readonly iconName = computed(() => (this.quiz().status === 'passed' ? 'check' : 'warning'));
  readonly statusClasses = computed(() =>
    this.quiz().status === 'passed'
      ? 'text-success-text-light dark:text-success-text-dark'
      : 'text-warning-text-light dark:text-warning-text-dark',
  );

  emitView(): void {
    this.viewResults.emit(this.quiz().id);
  }
}
