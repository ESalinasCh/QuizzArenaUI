import { Component, computed, inject, resource, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { GradeCard } from '../../../../shared/molecules/grade-card/grade-card';
import { Match } from '../../models/exam.model';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { GradeAttemptFilters } from '../../api/teacher-grades.contract';

@Component({
  selector: 'qz-teacher-grade-panel-page',
  imports: [GradeCard],
  templateUrl: './grade-panel-page.html',
})
export class TeacherGradePanelPage {
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

  readonly grades = resource({
    params: () => ({
      matchId: this.selectedMatchId(),
      filters: this.filters(),
    }),
    loader: async ({ params }) => {
      if (!params.matchId) {
        return [];
      }
      return firstValueFrom(
        this.#examService.getGrades(params.matchId, params.filters),
      );
    }
  });

  readonly expandedGrade = signal<string | null>(null);

  toggleAttempts(id: string): void {
    this.expandedGrade.update(current => (current === id ? null : id));
  }

  onMatchChange(matchId: string): void {
    this.selectedMatchId.set(matchId);
  }
}
