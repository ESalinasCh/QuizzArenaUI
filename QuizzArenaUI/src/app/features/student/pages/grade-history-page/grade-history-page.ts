import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AttemptHistoryCard } from '../../../../shared/organisms/attempt-history-card/attempt-history-card';
import { StudentQuizService } from '../../services/student-quiz.service';

@Component({
  selector: 'qz-student-grade-history-page',
  imports: [AttemptHistoryCard],
  templateUrl: './grade-history-page.html',

})
export class StudentGradeHistoryPage {
  readonly #router = inject(Router);
  readonly #studentQuizService = inject(StudentQuizService);

  readonly viewMode = signal<'cards' | 'table'>('cards');
  readonly viewLabel = $localize`:Attempt history view action label:View`;
  readonly attempts = toSignal(this.#studentQuizService.getGradeHistory(), {
    initialValue: [],
  });

  async viewAttempt(attemptId: string): Promise<void> {
    await this.#router.navigate(['/student/quizzes', attemptId, 'results'], {
      queryParams: { view: 'details' },
    });
  }
}
