import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, map, switchMap } from 'rxjs';
import { TruncatePipe } from '../../../../core/pipes/truncate.pipe';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { StatCard } from '../../../../shared/molecules/stat-card/stat-card';
import { StudentQuizService } from '../../services/student-quiz.service';

@Component({
  selector: 'qz-student-quiz-results-page',
  imports: [Icon, StatCard, TruncatePipe],
  templateUrl: './quiz-results-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentQuizResultsPage {
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #studentQuizService = inject(StudentQuizService);
  readonly showDetails = signal(this.#route.snapshot.queryParamMap.get('view') === 'details');

  readonly attemptId = toSignal(
    this.#route.paramMap.pipe(
      map(params => this.#getRequiredAttemptId(params.get('quizId'))),
      switchMap(attemptId => (attemptId ? [attemptId] : EMPTY)),
    ),
  );

  readonly summary = toSignal(
    this.#route.paramMap.pipe(
      map(params => this.#getRequiredAttemptId(params.get('quizId'))),
      switchMap(attemptId =>
        attemptId && !this.showDetails()
          ? this.#studentQuizService.getMatchAttemptResultSummary(attemptId)
          : EMPTY,
      ),
    ),
  );

  readonly review = toSignal(
    this.#route.paramMap.pipe(
      map(params => this.#getRequiredAttemptId(params.get('quizId'))),
      switchMap(attemptId =>
        attemptId ? this.#studentQuizService.getMatchAttemptDetail(attemptId) : EMPTY,
      ),
    ),
  );

  readonly scoreDashArray = computed(() => {
    const score = this.summary()?.scorePercentage ?? 0;

    return `${score} ${100 - score}`;
  });

  viewDetails(): void {
    this.showDetails.set(true);
  }

  goHome(): void {
    this.#navigate(['/student/quizzes']);
  }

  #getRequiredAttemptId(routeId: string | null): string | null {
    if (!routeId) {
      this.#navigate(['/student/quizzes']);
      return null;
    }

    return routeId;
  }

  #navigate(commands: Parameters<Router['navigate']>[0]): void {
    this.#router
      .navigate(commands)
      .then(navigated => {
        if (!navigated) {
          console.warn('Navigation was cancelled', commands);
        }
      })
      .catch(error => {
        console.error('Navigation failed', error);
      });
  }
}
