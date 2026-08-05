import { Component, computed, inject, signal, Signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { GradeCard } from '../../components/grade-card/grade-card';
import { Grade, Match, ResetAttemptResult } from '../../models/exam.model';
import { GradeAttemptFilters } from '../../api/teacher-grades.contract';
import { of } from 'rxjs';
import { ModalService } from '../../../../core/services/modal.service';
import { ResetAttemptModal } from '../../components/reset-attempt-modal/reset-attempt-modal';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'qz-teacher-grade-panel-page',
  imports: [GradeCard, Icon],
  templateUrl: './grade-panel-page.html',
})
export class TeacherGradePanelPage {
  readonly #modalService = inject(ModalService);
  readonly #examService = inject(TeacherExamService);
  readonly #router = inject(Router);

  readonly noGradesMessage = $localize`:Teacher no grades message:You don't have any grades.`;
  readonly selectedMatchId = signal<string>('');
  readonly matches: Signal<Match[]> = toSignal(this.#examService.getMatches(), {
    initialValue: [],
  });
  readonly selectedMatch = computed(
    () => this.matches().find((match) => match.id === this.selectedMatchId()) ?? null,
  );
  readonly filters = signal<GradeAttemptFilters>({
    Page: 1,
    PageSize: 10,
  });

  readonly grades = rxResource({
    params: () => {
      const matchId = this.selectedMatchId();
      return matchId ? { matchId, filters: this.filters() } : undefined;
    },
    stream: ({ params }) => {
      if (!params.matchId) {
        return of([]);
      }
      return this.#examService.getGrades(params.matchId, params.filters);
    },
  });

  readonly expandedGrades = signal<string[]>([]);

  toggleAttempts(id: string): void {
    this.expandedGrades.update((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
    );
  }

  onMatchChange(matchId: string): void {
    this.selectedMatchId.set(matchId);
  }

  async onViewResults(attemptId: string): Promise<void> {
    await this.#router.navigate(['/teacher/exams/attempts', attemptId, 'review'], {
      queryParams: {
        matchId: this.selectedMatchId(),
        nickname: this.#findNickname(attemptId),
      },
    });
  }

  #findNickname(attemptId: string): string {
    for (const grade of this.grades.value() ?? []) {
      if (grade.id === attemptId) {
        return grade.nickname;
      }

      const attempt = grade.otherAttempts.find((other) => other.id === attemptId);

      if (attempt) {
        return attempt.nickname;
      }
    }

    return '';
  }

  onResetAttempts(id: string): void {
    const grade = this.grades.value()?.find((g) => g.id === id);
    if (grade) {
      this.openResetModal(grade);
    }
  }

  openResetModal(grade: Grade) {
    const ref = this.#modalService.open<ResetAttemptModal, ResetAttemptResult>(
      ResetAttemptModal,
      { attempt: grade },
      { title: 'Reset Attempts' },
    );
    ref.afterClosed.then((result) => {
      if (result) {
        this.resetAttempts(result.matchId, result.userId);
      }
    });
  }

  private resetAttempts(matchId: string, userId: string): void {
    this.#examService.resetAttempts(matchId, userId).subscribe({
      next: () => {
        this.grades.reload();
      },
    });
  }
}
