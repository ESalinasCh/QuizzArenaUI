import { Component, computed, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { GradeCard } from '../../../../shared/molecules/grade-card/grade-card';
import { Match } from '../../models/exam.model';
import { GradeAttemptFilters } from '../../api/teacher-grades.contract';
import { of } from 'rxjs';

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

  readonly expandedGrade = signal<string | null>(null);

  toggleAttempts(id: string): void {
    this.expandedGrade.update(current => (current === id ? null : id));
  }

  onMatchChange(matchId: string): void {
    this.selectedMatchId.set(matchId);
  }
}
