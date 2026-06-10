import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { StatCard } from '../../../../shared/molecules/stat-card/stat-card';
import { StudentQuizService } from '../../services/student-quiz.service';

@Component({
  selector: 'app-student-quiz-results-page',
  standalone: true,
  imports: [Icon, StatCard],
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
      map(params => params.get('quizId') ?? 'attempt-project-1-review'),
      map(id => (id.startsWith('attempt-') ? id : `attempt-${id}`)),
    ),
    { initialValue: 'attempt-project-1-review' },
  );

  readonly summary = toSignal(
    this.#route.paramMap.pipe(
      map(params => params.get('quizId') ?? 'attempt-project-1-review'),
      map(id => (id.startsWith('attempt-') ? id : `attempt-${id}`)),
      switchMap(attemptId => this.#studentQuizService.getMatchAttemptResultSummary(attemptId)),
    ),
  );

  readonly review = toSignal(
    this.#route.paramMap.pipe(
      map(params => params.get('quizId') ?? 'attempt-project-1-week-7'),
      map(id => (id.startsWith('attempt-') ? id : `attempt-${id}`)),
      switchMap(attemptId => this.#studentQuizService.getMatchAttemptDetail(attemptId)),
    ),
  );

  readonly scoreDashArray = computed(() => {
    const score = this.summary()?.scorePercentage ?? 0;

    return `${score} ${100 - score}`;
  });

  answerPreview(value: string): string {
    return value.length > 18 ? `${value.slice(0, 18)}...` : value;
  }

  viewDetails(): void {
    this.showDetails.set(true);
  }

  goHome(): void {
    void this.#router.navigate(['/student/quizzes']);
  }
}
