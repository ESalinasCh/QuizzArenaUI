import { Component, computed, inject, input, Signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { Match } from '../../models/exam.model';
import { TeacherExamService } from '../../services/teacher-exam.service';

@Component({
  selector: 'qz-teacher-attempt-review-page',
  imports: [Icon],
  templateUrl: './attempt-review-page.html',
})
export class TeacherAttemptReviewPage {
  readonly #router = inject(Router);
  readonly #examService = inject(TeacherExamService);

  readonly attemptId = input.required<string>();
  readonly matchId = input<string>('');
  readonly nickname = input<string>('');

  readonly fallbackTitle = $localize`:Teacher attempt review fallback title:Attempt review`;

  readonly #matches: Signal<Match[]> = toSignal(this.#examService.getMatches(), {
    initialValue: [],
  });

  readonly match = computed(
    () => this.#matches().find((match) => match.id === this.matchId()) ?? null,
  );

  readonly title = computed(() => this.match()?.title ?? this.fallbackTitle);
  readonly subtitle = computed(() => this.nickname() || (this.match()?.courseName ?? ''));

  readonly review = rxResource({
    params: () => ({ attemptId: this.attemptId() }),
    stream: ({ params }) => this.#examService.getAttemptReview(params.attemptId),
  });

  async goBack(): Promise<void> {
    await this.#router.navigate(['/teacher/exams/attempts']);
  }
}
