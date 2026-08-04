import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, filter, firstValueFrom, map, of, switchMap } from 'rxjs';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { StudentQuizService } from '../../services/student-quiz.service';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'qz-student-exam-session-page',
  imports: [Icon],
  templateUrl: './exam-session-page.html',
})
export class StudentExamSessionPage {
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #studentQuizService = inject(StudentQuizService);
  readonly #themeService = inject(ThemeService);
  currentTheme = this.#themeService.currentTheme;

  readonly examLoadFailed = signal(false);
  readonly isStarting = signal(false);

  readonly exam = toSignal(
    this.#route.paramMap.pipe(
      map(params => params.get('examId')),
      filter((examId): examId is string => examId !== null),
      switchMap(examId =>
        this.#studentQuizService.getExamStart(examId).pipe(
          catchError(() => {
            this.examLoadFailed.set(true);

            return EMPTY;
          }),
        ),
      ),
    ),
  );

  readonly timeLimitLabel = computed(() => {
    const minutes = this.exam()?.timeLimitMinutes ?? 0;

    return $localize`:Student exam time limit label:Time limit ${minutes}:minutes: min`;
  });

  canLeaveAttemptFlow(): boolean {
    return this.examLoadFailed();
  }

  async goToExams(): Promise<void> {
    await this.#router.navigate(['/student/exams']);
  }

  async beginExam(): Promise<void> {
    const exam = this.exam();

    if (!exam || this.isStarting()) {
      return;
    }

    this.isStarting.set(true);

    const examStart = await firstValueFrom(
      this.#studentQuizService.startExamPlay(exam).pipe(
        catchError(() => of(undefined)),
      ),
    );

    this.isStarting.set(false);

    if (!examStart) {
      return;
    }

    await this.#router.navigate(['/student/exams', examStart.id, 'questions']);
  }
}
