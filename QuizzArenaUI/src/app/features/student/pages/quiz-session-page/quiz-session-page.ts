import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, switchMap } from 'rxjs';
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

  readonly quiz = toSignal(
    this.#route.paramMap.pipe(
      switchMap(params => {
        const quizId = params.get('quizId');

        if (!quizId) {
          this.#navigate(['/student/quizzes']);
          return EMPTY;
        }

        return this.#studentQuizService.getQuizStart(quizId);
      }),
    ),
  );

  readonly timeLimitLabel = computed(() => {
    const seconds = this.quiz()?.timeLimitSeconds ?? 0;

    return `Limite de tiempo ${seconds} seg`;
  });

  goBack(): void {
    this.#navigate(['/student/quizzes']);
  }

  beginQuiz(): void {
    const quizId = this.quiz()?.id;

    if (!quizId) {
      return;
    }

    this.#navigate(['/student/quizzes', quizId, 'questions']);
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
