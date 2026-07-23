import { Component, inject, signal, computed, debounced } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AttemptHistoryCard } from '../../../../shared/organisms/attempt-history-card/attempt-history-card';
import { StudentQuizService } from '../../services/student-quiz.service';
import { TextInput } from '../../../../shared/molecules/text-input/text-input';
import { Button } from '../../../../shared/atoms/button/button';
import { DEFAULT_PAGE_SIZE } from '../../../../core/models/pagination.model';

@Component({
  selector: 'qz-student-grade-history-page',
  imports: [AttemptHistoryCard, TextInput, Button],
  templateUrl: './grade-history-page.html',
})
export class StudentGradeHistoryPage {
  readonly #router = inject(Router);
  readonly #studentQuizService = inject(StudentQuizService);

  readonly searchQuery = signal('');
  readonly debouncedSearchQuery = debounced(this.searchQuery, 300);
  readonly limit = signal(DEFAULT_PAGE_SIZE);

  readonly viewMode = signal<'cards' | 'table'>('cards');
  readonly viewLabel = $localize`:Attempt history view action label:View`;

  readonly attemptsResource = rxResource({
    params: () => ({
      search: this.debouncedSearchQuery.value() ?? '',
      limit: this.limit()
    }),
    stream: ({ params }) => this.#studentQuizService.getGradeHistory({
      page: 1,
      pageSize: params.limit,
      search: params.search
    })
  });

  readonly visibleAttempts = computed(() => this.attemptsResource.value() ?? []);
  readonly attempts = this.visibleAttempts;

  readonly hasMoreAttempts = computed(() => {
    return this.visibleAttempts().length >= this.limit();
  });

  loadMore(): void {
    this.limit.update(l => l + DEFAULT_PAGE_SIZE);
  }

  async viewAttempt(attemptId: string): Promise<void> {
    await this.#router.navigate(['/student/quizzes', attemptId, 'results'], {
      queryParams: { view: 'details' },
    });
  }
}
