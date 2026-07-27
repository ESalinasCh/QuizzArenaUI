import { Component, input, output } from '@angular/core';
import { Button } from '../../../../shared/atoms/button/button';
import { ItemContainer } from '../../../../shared/atoms/item-container/item-container';
import { QuizResponseAsExams } from '../../api/teacher-exam.contract';

@Component({
  selector: 'qz-exam-bank-item',
  imports: [Button, ItemContainer],
  templateUrl: './exam-bank-item.html',
  styleUrl: './exam-bank-item.css',
})
export class ExamBankItem {
  readonly quizAsExams = input.required<QuizResponseAsExams>();
  readonly publish = output<void>();

  protected readonly publishAriaLabel = $localize`:Exam bank publish button aria label:Publish exam`;
}

