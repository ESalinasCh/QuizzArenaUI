import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { SectionTitle } from '../../../../shared/molecules/section-title/section-title';
import { AvailableQuizCard } from '../../components/available-quiz-card/available-quiz-card';
import { StudentQuizService } from '../../services/student-quiz.service';
import { MatchFilters, MatchStatus } from '../../api/student-quiz.contract';
import { FilterTabs } from '../../components/filter-tabs/filter-tabs';
import { catchError, of } from 'rxjs';
import { FilterStatusOption } from '../../models/student-quiz.model';

@Component({
  selector: 'qz-student-exam-list-page',
  imports: [AvailableQuizCard, SectionTitle, FilterTabs],
  templateUrl: './exam-list-page.html',

})
export class StudentExamListPage {
  readonly #router = inject(Router);
  readonly #studentQuizService = inject(StudentQuizService);
  protected readonly statusOptions: FilterStatusOption[] = [
    {
      label: 'Pending',
      value: 'Pending',
    },
    {
      label: 'Active',
      value: 'Active',
    },
  ];

  readonly filters = signal<MatchFilters>({
    status: 'Pending',
    mode: 'Exam',
  });

  readonly availableExamsTitle = $localize`:Student available exams section title:Available Exams`;
  readonly recentExamsTitle = $localize`:Student recent exams section title:Recent Exams`;
  readonly studentFallbackName = $localize`:Student fallback display name:Student`;
  readonly noExamsMessage = $localize`:Student no exams message:You don't have any exams.`;

  readonly exams = rxResource({
    params: () => this.filters(),
    stream: ({ params: filters }) =>
      this.#studentQuizService.getMatches(filters).pipe(catchError(() => of([]))),
  });

  async startQuiz(examId: string): Promise<void> {
    await this.#router.navigate(['/student/exams', examId, 'start']);
  }

  protected changeStatus(status: MatchStatus) {
    if (this.filters().status != status) {
      this.filters.update(filters => ({
        ...filters,
        status,
      }));
    }
  }
}
