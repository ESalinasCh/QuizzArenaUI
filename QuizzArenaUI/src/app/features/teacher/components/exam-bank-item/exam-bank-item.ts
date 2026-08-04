import { Component, input, output } from '@angular/core';
import { Button } from '../../../../shared/atoms/button/button';
import { ItemContainer } from '../../../../shared/atoms/item-container/item-container';
import { QuizResponseAsExams } from '../../api/teacher-exam.contract';
import { Match } from '../../models/exam.model';
import { MatchOfQuizItem } from '../match-of-quiz-item/match-of-quiz-item';

@Component({
  selector: 'qz-exam-bank-item',
  imports: [Button, ItemContainer, MatchOfQuizItem],
  templateUrl: './exam-bank-item.html',
  styleUrl: './exam-bank-item.css',
})
export class ExamBankItem {
  readonly quizAsExams = input.required<QuizResponseAsExams>();
  readonly matches = input<Match[]>([]);
  readonly publish = output<void>();
  readonly checkOthers = output<void>();
  readonly unpublishMatch = output<Match>();
  readonly viewQuestions = output<void>();

  protected readonly publishAriaLabel = $localize`:Exam bank publish button aria label:Publish exam`;
  protected readonly checkOthersAriaLabel = $localize`:Exam bank check others button aria label:Check others`;
  protected readonly viewQuestionsAriaLabel = $localize`:Exam bank view questions aria label:View exam questions`;
}


