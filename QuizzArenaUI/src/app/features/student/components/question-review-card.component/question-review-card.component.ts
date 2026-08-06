import { Component, computed, input } from '@angular/core';
import { MatchAttemptDetailQuestionResponse } from '../../api/student-quiz.contract';
import { Icon } from "../../../../shared/atoms/icon/icon";

@Component({
  selector: 'qz-question-review-card',
  imports: [Icon],
  templateUrl: './question-review-card.component.html',
  styleUrl: './question-review-card.component.css',
})
export class QuestionReviewCardComponent {
  question = input.required<MatchAttemptDetailQuestionResponse>();

  questionNumber = input.required<number>();

  totalQuestions = input.required<number>();

  readonly reviewOptions = computed(() =>
    this.question().options.map((option, index) => {
      const selected = this.question().selectedOptionIds.includes(option.id);
      return(
      {
      ...option,
      selected,
      showCorrect: option.isCorrect === true,
      showIncorrect: selected && option.isCorrect === false,
      letter: String.fromCharCode(65 + index),
    })}),
  );
}
