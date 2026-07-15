import { Component, input, output } from '@angular/core';

@Component({
  selector: 'qz-quiz-card',
  templateUrl: './quiz-card.html',
})
export class QuizCard {
  title = input.required<string>();
  actionLabel = input.required<string>();

  actionClick = output<void>();
}
