import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { SectionTitle } from '../../../../shared/molecules/section-title/section-title';
import { AvailableQuizCard } from '../../components/available-quiz-card/available-quiz-card';
import { StudentQuizService } from '../../services/student-quiz.service';
import { MatchFilters, MatchStatus } from '../../api/student-quiz.contract';
import { catchError, of } from 'rxjs';
import { FilterStatusOption } from '../../models/student-quiz.model';
import { EmptyState } from '../../../../shared/molecules/empty-state/empty-state';
import { InfoCard } from '../../../../shared/molecules/info-card/info-card';
import { DEFAULT_PAGE_SIZE } from '../../../../core/models/pagination.model';
import { Button } from '../../../../shared/atoms/button/button';

@Component({
  selector: 'qz-student-exam-list-page',
  imports: [AvailableQuizCard, SectionTitle, EmptyState, InfoCard, Button],
  templateUrl: './exam-list-page.html',
})
export class StudentExamListPage {
  readonly #router = inject(Router);
  readonly #studentQuizService = inject(StudentQuizService);
  readonly examLimit = signal(DEFAULT_PAGE_SIZE);
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
    status: 'Active',
    mode: 'Exam',
    pageSize: this.examLimit(),
  });

  readonly availableExamsTitle = $localize`:Student available exams section title:Available Exams`;
  readonly recentExamsTitle = $localize`:Student recent exams section title:Recent Exams`;
  readonly studentFallbackName = $localize`:Student fallback display name:Student`;
  readonly noExamsMessage = $localize`:Student no exams message:You don't have any exams.`;
  readonly noExamsMatchingMessage = $localize`:Student no exams matching category message:There are no evaluations matching the selected category right now.`;
  readonly evaluationGuidelinesTitle = $localize`:Student evaluation guidelines title:Evaluation Guidelines`;

  readonly exams = rxResource({
    params: () => this.filters(),
    stream: ({ params: filters }) =>
      this.#studentQuizService.getMatches(filters).pipe(catchError(() => of([]))),
  });

  readonly visibleExams = computed(() =>
    this.exams.hasValue() ? this.exams.value() : [],
  );
  readonly hasMoreRecent = computed(() => this.visibleExams().length >= (this.filters().pageSize ?? DEFAULT_PAGE_SIZE));

  loadMoreExams(): void {
    this.filters.update(filters => ({
      ...filters,
      pageSize: (filters.pageSize ?? DEFAULT_PAGE_SIZE) + DEFAULT_PAGE_SIZE,
    }));
  }

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
