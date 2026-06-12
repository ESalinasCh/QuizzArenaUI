import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { LinkActionForm } from '../../../../shared/organisms/link-action-form/link-action-form';

@Component({
  selector: 'app-quiz-access-form',
  imports: [LinkActionForm],
  templateUrl: './quiz-access-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizAccessForm {
  submitQuizLink = output<string>();

  submit(quizLink: string): void {
    this.submitQuizLink.emit(quizLink);
  }
}
