import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Button } from '../../../../shared/atoms/button/button';
import { ItemContainer } from '../../../../shared/atoms/item-container/item-container';
import { StatusLabel } from '../../../../shared/atoms/status-label/status-label';
import { StatusVariantPipe } from '../../../../shared/pipes/status-variant.pipe';
import { QuizResponseAsExams } from '../../api/teacher-exam.contract';
import { Match } from '../../models/exam.model';

@Component({
  selector: 'qz-exam-bank-item',
  imports: [Button, ItemContainer, StatusLabel, StatusVariantPipe, DatePipe],
  templateUrl: './exam-bank-item.html',
  styleUrl: './exam-bank-item.css',
})
export class ExamBankItem {
  readonly quizAsExams = input.required<QuizResponseAsExams>();
  readonly matches = input<Match[]>([]);
  readonly publish = output<void>();
  readonly checkOthers = output<void>();
  readonly unpublishMatch = output<Match>();

  protected readonly publishAriaLabel = $localize`:Exam bank publish button aria label:Publish exam`;
  protected readonly checkOthersAriaLabel = $localize`:Exam bank check others button aria label:Check others`;
  protected readonly unpublishAriaLabel = $localize`:Exam bank unpublish match button aria label:Unpublish match`;
}

