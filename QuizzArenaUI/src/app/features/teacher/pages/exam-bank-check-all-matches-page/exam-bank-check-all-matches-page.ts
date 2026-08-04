import { Component, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, take } from 'rxjs/operators';
import { MatchFilters, TeacherExamService } from '../../services/teacher-exam.service';
import { Button } from '../../../../shared/atoms/button/button';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { ItemContainer } from '../../../../shared/atoms/item-container/item-container';
import { Match } from '../../models/exam.model';
import { DEFAULT_PAGE_SIZE } from '../../../../core/models/pagination.model';
import { MatchOfQuizItem } from '../../components/match-of-quiz-item/match-of-quiz-item';
import { NavigationHistoryService } from '../../../../core/services/navigation-history.service';
import { Router } from '@angular/router';

@Component({
  selector: 'qz-exam-bank-check-all-matches-page',
  imports: [Button, Icon, ItemContainer, MatchOfQuizItem],
  templateUrl: './exam-bank-check-all-matches-page.html',
})
export class ExamBankCheckAllMatchesPage {
  readonly #router = inject(Router);
  readonly quizId = input<string>();

  readonly #navigationHistoryService = inject(NavigationHistoryService);
  readonly #examService = inject(TeacherExamService);

  protected readonly backAriaLabel = $localize`:Check all matches back button aria label:Back`;
  protected readonly unpublishAriaLabel = $localize`:Check all matches unpublish aria label:Unpublish match`;

  readonly matchPage = signal(1);
  readonly matchPageSize = signal(DEFAULT_PAGE_SIZE);

  readonly matches = signal<Match[]>([]);
  readonly matchesResource = rxResource<void, MatchFilters>({
    params: () => ({
      quizId: this.quizId(),
      page: this.matchPage(),
      pageSize: this.matchPageSize(),
    }),
    stream: ({ params }) => {
      return this.#examService.getMatches(params).pipe(
        take(1),
        map((resp) => {
          this.isHasMoreMatches.set(resp.length === this.matchPageSize());
          if (params.page === 1) {
            this.matches.set(resp);
          } else {
            this.matches.update(prev => [...prev, ...resp]);
          }
          return void [];
        }),
      );
    },
  });

  readonly isHasMoreMatches = signal(false);

  loadMoreMatches(): void {
    if (!this.isHasMoreMatches()) return;
    this.matchPage.update(page => page + 1);
  }

  goBack(): void {
    this.#navigationHistoryService.back('/teacher/exams/bank');
  }

  editMatch(match: Match): void {
    this.#router.navigate(['/teacher/exams/edit', match.id]);
  }

  unpublishMatch(match: Match): void {
    this.#examService.unpublishMatch(match.id).pipe(take(1)).subscribe({
      next: () => {
        this.matches.update(prev =>
          prev.map(currentMatch =>
            currentMatch.id === match.id
              ? { ...currentMatch, status: 'Pending' }
              : currentMatch
          )
        );
      }
    });
  }
}
