import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, filter, map, switchMap } from 'rxjs';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { StudentQuizService } from '../../services/student-quiz.service';

@Component({
  selector: 'qz-student-quiz-session-page',
  imports: [Icon],
  templateUrl: './quiz-session-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentQuizSessionPage {
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #studentQuizService = inject(StudentQuizService);

  readonly quizLoadFailed = signal(false);

  readonly quiz = toSignal(
    this.#route.paramMap.pipe(
      map(params => params.get('quizId')),
      filter((quizId): quizId is string => quizId !== null),
      switchMap(quizId =>
        this.#studentQuizService.getQuizStart(quizId).pipe(
          catchError(() => {
            this.quizLoadFailed.set(true);

            return EMPTY;
          }),
        ),
      ),
    ),
  );

  readonly timeLimitLabel = computed(() => {
    const minutes = this.quiz()?.timeLimitMinutes ?? 0;

    return $localize`:Student quiz time limit label:Time limit ${minutes}:minutes: min`;
  });

  async beginQuiz(): Promise<void> {
    const quizId = this.quiz()?.id;

    if (!quizId) {
      return;
    }

    await this.#router.navigate(['/student/quizzes', quizId, 'questions']);
  }
}
