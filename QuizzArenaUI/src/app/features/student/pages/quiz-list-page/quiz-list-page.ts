import { Component, computed, debounced, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../core/services/auth.service';
import { SectionTitle } from '../../../../shared/molecules/section-title/section-title';
import { AvailableQuizCard } from '../../components/available-quiz-card/available-quiz-card';
import { QuizAccessForm } from '../../components/quiz-access-form/quiz-access-form';
import { RecentQuizCard } from '../../components/recent-quiz-card/recent-quiz-card';
import { StudentQuizService } from '../../services/student-quiz.service';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { EmptyState } from '../../../../shared/molecules/empty-state/empty-state';
import { InfoCard } from '../../../../shared/molecules/info-card/info-card';
import { TextInput } from '../../../../shared/molecules/text-input/text-input';
import { DEFAULT_PAGE_SIZE } from '../../../../core/models/pagination.model';
import { Button } from '../../../../shared/atoms/button/button';

@Component({
  selector: 'qz-student-quiz-list-page',
  imports: [
    AvailableQuizCard,
    QuizAccessForm,
    RecentQuizCard,
    SectionTitle,
    Icon,
    EmptyState,
    InfoCard,
    TextInput,
    Button
  ],
  templateUrl: './quiz-list-page.html',
})
export class StudentQuizListPage {
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);
  readonly #studentQuizService = inject(StudentQuizService);

  readonly availableSearchQuery = signal('');
  readonly debouncedAvailableSearch = debounced(this.availableSearchQuery, 300);
  readonly recentSearchQuery = signal('');
  readonly debouncedRecentSearch = debounced(this.recentSearchQuery, 300);
  readonly availableLimit = signal(DEFAULT_PAGE_SIZE);
  readonly recentLimit = signal(DEFAULT_PAGE_SIZE);

  readonly availableQuizzesTitle = $localize`:Student dashboard available quizzes section title:Available Quizzes`;
  readonly recentQuizzesTitle = $localize`:Student dashboard recent quizzes section title:Recent Quizzes`;
  readonly studentFallbackName = $localize`:Student fallback display name:Student`;
  readonly noQuizzesAvailableTitle = $localize`:Student no quizzes available title:No quizzes available`;
  readonly noQuizzesAvailableDescription = $localize`:Student no quizzes available description:Ask your teacher to share a quiz or upload class materials.`;
  readonly noHistoryTitle = $localize`:Student no history title:No history`;
  readonly noHistoryDescription = $localize`:Student no history description:Complete your first quiz to see your history here.`;
  readonly proTipTitle = $localize`:Student pro tip title:Pro Tip`;

  readonly availableQuizzesResource = rxResource({
    params: () => ({
      search: this.debouncedAvailableSearch.value() ?? '',
      limit: this.availableLimit(),
    }),
    stream: ({ params }) =>
      this.#studentQuizService.getAvailableQuizzes({ page: 1, pageSize: params.limit, search: params.search }),
  });

  readonly visibleAvailableQuizzes = computed(() => this.availableQuizzesResource.value() ?? []);
  readonly hasMoreAvailable = computed(() => this.visibleAvailableQuizzes().length >= this.availableLimit());

  readonly recentQuizzesResource = rxResource({
    params: () => ({
      search: this.debouncedRecentSearch.value() ?? '',
      limit: this.recentLimit(),
    }),
    stream: ({ params }) =>
      this.#studentQuizService.getRecentQuizzes({ page: 1, pageSize: params.limit, search: params.search }),
  });

  readonly visibleRecentQuizzes = computed(() => this.recentQuizzesResource.value() ?? []);
  readonly hasMoreRecent = computed(() => this.visibleRecentQuizzes().length >= this.recentLimit());

  loadMoreAvailable(): void {
    this.availableLimit.update(limit => limit + DEFAULT_PAGE_SIZE);
  }

  loadMoreRecent(): void {
    this.recentLimit.update(limit => limit + DEFAULT_PAGE_SIZE);
  }

  readonly displayName = computed(() => {
    const user = this.#authService.currentUser();
    return user?.name?.split(' ')[0] ?? user?.username ?? this.studentFallbackName;
  });

  async startQuiz(quizId: string): Promise<void> {
    await this.#router.navigate(['/student/quizzes', quizId, 'start']);
  }

  async viewResults(quizId: string): Promise<void> {
    await this.#router.navigate(['/student/quizzes', quizId, 'results'], {
      queryParams: { view: 'details' },
    });
  }

  async goToQuizFromLink(quizLink: string): Promise<void> {
    if (!quizLink) {
      return;
    }

    const quizId = quizLink.split('/').filter(Boolean).at(-1) ?? quizLink;
    await this.startQuiz(quizId);
  }
}
