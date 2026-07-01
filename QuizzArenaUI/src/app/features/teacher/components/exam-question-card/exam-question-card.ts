import { Component, input, output } from '@angular/core';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { Question } from '../../models/exam.model';

@Component({
  selector: 'qz-exam-question-card',
  imports: [Icon],
  templateUrl: './exam-question-card.html',
})
export class ExamQuestionCard {
  question = input.required<Question>();
  selected = input.required<boolean>();

  toggleSelect = output<void>();
  remove = output<void>();
}
