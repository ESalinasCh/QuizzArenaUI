import { Component, computed, input } from '@angular/core';
import { MatchAttemptDetailQuestionResponse } from '../../api/student-quiz.contract';

@Component({
  selector: 'qz-question-review-card',
  imports: [],
  templateUrl: './question-review-card.component.html',
  styleUrl: './question-review-card.component.css',
})
export class QuestionReviewCardComponent {
  question = input.required<MatchAttemptDetailQuestionResponse>();

  questionNumber = input.required<number>();

  totalQuestions = input.required<number>();

  readonly reviewOptions = computed(() =>
    this.question().options.map(option => ({
      ...option,
      selected: this.question().selectedOptionIds.includes(option.id),
    })),
  );
}
