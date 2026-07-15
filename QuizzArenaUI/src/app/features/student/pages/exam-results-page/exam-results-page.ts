import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { StudentQuizService } from '../../services/student-quiz.service';

@Component({
  selector: 'qz-student-exam-results-page',
  imports: [Icon],
  templateUrl: './exam-results-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentExamResultsPage {
  readonly #router = inject(Router);
  readonly #studentQuizService = inject(StudentQuizService);

  readonly result = computed(() => this.#studentQuizService.getCompletedExamResult());
  readonly answeredProgressLabel = computed(() => {
    const result = this.result();
    const answered = result?.answeredQuestions ?? 0;
    const total = result?.totalQuestions ?? 0;

    return $localize`:Student exam answered progress label:Answered ${answered}:answered: of ${total}:total:`;
  });

  async goHome(): Promise<void> {
    await this.#router.navigate(['/student/exams']);
  }
}
