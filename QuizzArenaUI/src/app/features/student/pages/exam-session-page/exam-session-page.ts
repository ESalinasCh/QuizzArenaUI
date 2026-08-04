import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, filter, firstValueFrom, map, of, switchMap } from 'rxjs';
import { ModalService } from '../../../../core/services/modal.service';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { AttemptStartDialog } from '../../../../shared/molecules/attempt-start-dialog/attempt-start-dialog';
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
  readonly #modalService = inject(ModalService);
  readonly #themeService = inject(ThemeService);
  currentTheme = this.#themeService.currentTheme;

  readonly examLoadFailed = signal(false);
  readonly isStarting = signal(false);
  readonly startConfirmationTitle = $localize`:Student exam start confirmation title:Start exam`;
  readonly startConfirmationMessage = $localize`:Student exam start confirmation message:You are about to start this exam. Once you begin, your progress will be tracked as you answer each question.`;
  readonly startConfirmationCancelLabel = $localize`:Student exam start confirmation cancel:Cancel`;
  readonly startConfirmationActionLabel = $localize`:Student exam start confirmation action:Start exam`;

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

    const confirmed = await this.#confirmStart();

    if (!confirmed) {
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

  async #confirmStart(): Promise<boolean> {
    const modalRef = this.#modalService.open<AttemptStartDialog, boolean>(
      AttemptStartDialog,
      {
        message: this.startConfirmationMessage,
        cancelLabel: this.startConfirmationCancelLabel,
        confirmLabel: this.startConfirmationActionLabel,
      },
      {
        title: this.startConfirmationTitle,
        closeOnOverlayClick: false,
        width: 'min(90vw, 420px)',
      },
    );

    return (await modalRef.afterClosed) ?? false;
  }
}
