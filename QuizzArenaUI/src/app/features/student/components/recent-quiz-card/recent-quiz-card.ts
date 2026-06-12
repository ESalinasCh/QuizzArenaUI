import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RecentQuizMeta } from '../../../../shared/molecules/recent-quiz-meta/recent-quiz-meta';
import { QuizCard } from '../../../../shared/organisms/quiz-card/quiz-card';
import { RecentQuiz } from '../../models/student-quiz.model';

@Component({
  selector: 'app-recent-quiz-card',
  standalone: true,
  imports: [QuizCard, RecentQuizMeta],
  templateUrl: './recent-quiz-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentQuizCard {
  quiz = input.required<RecentQuiz>();
  viewResults = output<string>();

  emitView(): void {
    this.viewResults.emit(this.quiz().id);
  }
}
