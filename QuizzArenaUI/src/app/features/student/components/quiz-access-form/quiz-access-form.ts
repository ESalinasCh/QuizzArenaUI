import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Icon } from '../../../../shared/atoms/icon/icon';

@Component({
  selector: 'app-quiz-access-form',
  standalone: true,
  imports: [FormsModule, Icon],
  templateUrl: './quiz-access-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizAccessForm {
  quizLink = signal('');
  submitQuizLink = output<string>();

  submit(): void {
    this.submitQuizLink.emit(this.quizLink().trim());
  }
}
