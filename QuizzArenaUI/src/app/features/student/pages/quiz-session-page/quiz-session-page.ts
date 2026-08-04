import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, filter, firstValueFrom, map, of, switchMap } from 'rxjs';
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
  readonly isStarting = signal(false);

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

  canLeaveAttemptFlow(): boolean {
    return this.quizLoadFailed();
  }

  async goToQuizzes(): Promise<void> {
    await this.#router.navigate(['/student/quizzes']);
  }

  async beginQuiz(): Promise<void> {
    const quiz = this.quiz();

    if (!quiz || this.isStarting()) {
      return;
    }

    this.isStarting.set(true);

    const quizStart = await firstValueFrom(
      this.#studentQuizService.startQuizPlay(quiz).pipe(
        catchError(() => of(undefined)),
      ),
    );

    this.isStarting.set(false);

    if (!quizStart) {
      return;
    }

    await this.#router.navigate(['/student/quizzes', quizStart.id, 'questions']);
  }
}
