import { Component, input } from '@angular/core';

@Component({
  selector: 'qz-stats-card',
  standalone: true,
  imports: [],
  templateUrl: './stats-card.html',
})
export class StatsCard {
  readonly quizCount = input.required<number>();
  readonly publishedCount = input.required<number>();
  readonly quizzesLabel = input.required<string>();
  readonly publishedLabel = input.required<string>();
}
