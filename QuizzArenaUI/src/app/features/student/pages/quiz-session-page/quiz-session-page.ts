import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { StudentQuizService } from '../../services/student-quiz.service';

@Component({
  selector: 'app-student-quiz-session-page',
  standalone: true,
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
      map(params => params.get('quizId') ?? 'project-1-review'),
      switchMap(quizId => this.#studentQuizService.getQuizStart(quizId)),
    ),
  );

  readonly timeLimitLabel = computed(() => {
    const seconds = this.quiz()?.timeLimitSeconds ?? 0;

    return `Limite de tiempo ${seconds} seg`;
  });

  goBack(): void {
    void this.#router.navigate(['/student/quizzes']);
  }

  beginQuiz(): void {
    const quizId = this.quiz()?.id;

    if (!quizId) {
      return;
    }

    void this.#router.navigate(['/student/quizzes', quizId, 'questions']);
  }
}
