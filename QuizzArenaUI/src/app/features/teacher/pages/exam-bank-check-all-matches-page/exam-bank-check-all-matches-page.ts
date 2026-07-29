import { Component, computed, inject, input, signal } from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap, take } from 'rxjs/operators';
import { MatchFilters, TeacherExamService } from '../../services/teacher-exam.service';
import { Button } from '../../../../shared/atoms/button/button';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { ItemContainer } from '../../../../shared/atoms/item-container/item-container';
import { StatusLabel } from '../../../../shared/atoms/status-label/status-label';
import { StatusVariantPipe } from '../../../../shared/pipes/status-variant.pipe';
import { Match } from '../../models/exam.model';
import { DEFAULT_PAGE_SIZE } from '../../../../core/models/pagination.model';
import { MatchOfQuizItem } from "../../components/match-of-quiz-item/match-of-quiz-item";

@Component({
  selector: 'qz-exam-bank-check-all-matches-page',
  imports: [Button, Icon, ItemContainer, StatusLabel, StatusVariantPipe, DatePipe, MatchOfQuizItem],
  templateUrl: './exam-bank-check-all-matches-page.html',
})
export class ExamBankCheckAllMatchesPage {
  readonly quizId = input<string>();

  readonly #router = inject(Router);
  readonly #location = inject(Location);
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
  })

  isHasMoreMatches = signal(false);

  loadMoreMatches() {
    if (!this.isHasMoreMatches()) return
    this.matchPage.update(page => page + 1);
  }


  goBack(): void {
    if (window.history.length > 1) {
      this.#location.back();
    } else {
      void this.#router.navigate(['/teacher/exams/bank']);
    }
  }

  unpublishMatch(match: Match): void {
    this.#examService.unpublishMatch(match.id).pipe(take(1)).subscribe({
      next: () => {
        // this.#refresh.update(n => n + 1);
      },
    });
  }
}
