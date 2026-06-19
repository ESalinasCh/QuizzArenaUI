import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'qz-quiz-card',
  standalone: true,
  templateUrl: './quiz-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizCard {
  title = input.required<string>();
  actionLabel = input.required<string>();

  actionClick = output<void>();
}
