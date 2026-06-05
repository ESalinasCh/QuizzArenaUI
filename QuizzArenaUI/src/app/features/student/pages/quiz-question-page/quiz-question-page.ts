import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { StudentQuizService } from '../../services/student-quiz.service';

@Component({
  selector: 'app-student-quiz-question-page',
  standalone: true,
  imports: [Icon],
  templateUrl: './quiz-question-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentQuizQuestionPage {
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #studentQuizService = inject(StudentQuizService);

  readonly selectedOptionId = signal<string | null>(null);
  readonly questionIndex = signal(0);
  readonly optionLetters = ['A', 'B', 'C', 'D'];

  readonly quiz = toSignal(
    this.#route.paramMap.pipe(
      map(params => params.get('quizId') ?? 'project-1-review'),
      switchMap(quizId => this.#studentQuizService.getQuizStart(quizId)),
    ),
  );

  readonly currentQuestion = computed(() => this.quiz()?.questions[this.questionIndex()]);
  readonly progressLabel = computed(() => {
    const current = this.questionIndex() + 1;
    const total = this.quiz()?.questions.length ?? 0;

    return `Pregunta ${current} de ${total}`;
  });
  readonly progressValue = computed(() => {
    const total = this.quiz()?.questions.length ?? 0;

    if (!total) {
      return '0%';
    }

    return `${((this.questionIndex() + 1) / total) * 100}%`;
  });

  goBack(): void {
    const quizId = this.quiz()?.id;
    void this.#router.navigate(['/student/quizzes', quizId, 'start']);
  }

  selectOption(optionId: string): void {
    this.selectedOptionId.set(optionId);
  }

  confirmAnswer(): void {
    if (!this.selectedOptionId()) {
      return;
    }

    const total = this.quiz()?.questions.length ?? 0;
    const nextIndex = this.questionIndex() + 1;

    if (nextIndex < total) {
      this.questionIndex.set(nextIndex);
      this.selectedOptionId.set(null);
      return;
    }

    const quizId = this.quiz()?.id;
    void this.#router.navigate(['/student/quizzes', quizId, 'results']);
  }
}
