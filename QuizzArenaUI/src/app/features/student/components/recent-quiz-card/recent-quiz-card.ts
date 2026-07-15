import { Component, input, output } from '@angular/core';
import { RecentQuizMeta } from '../../../../shared/molecules/recent-quiz-meta/recent-quiz-meta';
import { QuizCard } from '../../../../shared/organisms/quiz-card/quiz-card';
import { RecentQuiz } from '../../models/student-quiz.model';

@Component({
  selector: 'qz-recent-quiz-card',
  imports: [QuizCard, RecentQuizMeta],
  templateUrl: './recent-quiz-card.html',
})
export class RecentQuizCard {
  quiz = input.required<RecentQuiz>();
  viewResults = output<string>();

  readonly viewActionLabel = $localize`:Recent quiz card view action:View`;

  emitView(): void {
    this.viewResults.emit(this.quiz().id);
  }
}
