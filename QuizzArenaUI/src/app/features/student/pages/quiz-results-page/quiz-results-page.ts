import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, filter, map, shareReplay, switchMap } from 'rxjs';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { StatCard } from '../../../../shared/molecules/stat-card/stat-card';
import { StudentQuizService } from '../../services/student-quiz.service';

@Component({
  selector: 'qz-student-quiz-results-page',
  imports: [Icon, StatCard],
  templateUrl: './quiz-results-page.html',

})
export class StudentQuizResultsPage {
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #studentQuizService = inject(StudentQuizService);
  readonly showDetails = signal(this.#route.snapshot.queryParamMap.get('view') === 'details');

  readonly incorrectAnswersLabel = $localize`:Student quiz incorrect answers stat label:Incorrect`;
  readonly correctAnswersLabel = $localize`:Student quiz correct answers stat label:Correct`;

  readonly #attemptId$ = this.#route.paramMap.pipe(
    map(params => params.get('quizId')),
    filter((attemptId): attemptId is string => attemptId !== null),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly attemptId = toSignal(this.#attemptId$);

  readonly summary = toSignal(
    this.#attemptId$.pipe(
      switchMap(attemptId =>
        !this.showDetails()
          ? this.#studentQuizService.getMatchAttemptResultSummary(attemptId)
          : EMPTY,
      ),
    ),
  );

  readonly review = toSignal(
    this.#attemptId$.pipe(
      switchMap(attemptId => this.#studentQuizService.getMatchAttemptDetail(attemptId)),
    ),
  );

  readonly scoreDashArray = computed(() => {
    const score = this.summary()?.scorePercentage ?? 0;

    return `${score} ${100 - score}`;
  });

  viewDetails(): void {
    this.showDetails.set(true);
  }

  async goHome(): Promise<void> {
    await this.#router.navigate(['/student/quizzes']);
  }
}
