import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Button } from '../../../../shared/atoms/button/button';
import { StatusLabel } from '../../../../shared/atoms/status-label/status-label';
import { StatusVariantPipe } from '../../../../shared/pipes/status-variant.pipe';
import { Match } from '../../models/exam.model';
import { TextSpan } from "../../../../shared/atoms/text-span/text-span";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'qz-match-of-quiz-item',
  imports: [Button, StatusLabel, StatusVariantPipe, DatePipe, TextSpan, RouterLink],
  templateUrl: './match-of-quiz-item.html',
  styleUrl: './match-of-quiz-item.css',
})
export class MatchOfQuizItem {
  readonly quizId = input.required<string>();
  readonly match = input.required<Match>();
  readonly unpublishMatch = output<Match>();
  readonly publishMatch = output<Match>();

  protected readonly unpublishAriaLabel = $localize`:Exam bank unpublish match button aria label:Unpublish match`;
}
