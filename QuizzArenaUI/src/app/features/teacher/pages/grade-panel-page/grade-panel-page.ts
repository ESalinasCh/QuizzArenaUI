import { Component, computed, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { GradeCard } from '../../../../shared/molecules/grade-card/grade-card';
import { Grade, Match } from '../../models/exam.model';
import { GradeAttemptFilters } from '../../api/teacher-grades.contract';
import { of } from 'rxjs';
import { ModalService } from '../../../../core/services/modal.service';
import { ResetAttemptModal } from '../../components/reset-attempt-modal/reset-attempt-modal';
import { Icon } from '../../../../shared/atoms/icon/icon';

@Component({
  selector: 'qz-teacher-grade-panel-page',
  imports: [GradeCard, Icon],
  templateUrl: './grade-panel-page.html',
})
export class TeacherGradePanelPage {
  readonly #modalService = inject(ModalService);
  readonly #examService = inject(TeacherExamService);

  readonly noGradesMessage = $localize`:Teacher no grades message:You don't have any grades.`;
  readonly selectedMatchId = signal<string>('');
  readonly matches = toSignal(this.#examService.getMatches(), { initialValue: [] as Match[] });
  readonly selectedMatch = computed(() =>
    this.matches().find(match => match.id === this.selectedMatchId()) ?? null,
  );
  readonly filters = signal<GradeAttemptFilters>({
    Page: 1,
    PageSize: 10
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
    this.expandedGrades.update(ids =>
      ids.includes(id)
        ? ids.filter(x => x !== id)
        : [...ids, id]
    );
  }

  onMatchChange(matchId: string): void {
    this.selectedMatchId.set(matchId);
  }

  onResetAttempts(id: string): void {
    const grade = this.grades.value()?.find(g => g.id === id);
    if (grade) {
      this.openResetModal(grade);
    }
  }

  openResetModal(grade: Grade) {
    const ref = this.#modalService.open<ResetAttemptModal, string>(ResetAttemptModal, { attempt: grade }, { title: 'Reset Attempts' });
    ref.afterClosed.then((userId) => {
      if (userId) {
        this.resetAttempts(userId);
      }
    });
  }

  private resetAttempts(userId: string): void {
    this.#examService.resetAttempts(userId).subscribe({
      next: () => {
        this.grades.reload();
      }
    });
  }
}
