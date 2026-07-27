import { Component, computed, inject, input, signal } from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { Button } from '../../../../shared/atoms/button/button';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { ItemContainer } from '../../../../shared/atoms/item-container/item-container';
import { StatusLabel } from '../../../../shared/atoms/status-label/status-label';
import { StatusVariantPipe } from '../../../../shared/pipes/status-variant.pipe';
import { Match } from '../../models/exam.model';

@Component({
  selector: 'qz-exam-bank-check-all-matches-page',
  imports: [Button, Icon, ItemContainer, StatusLabel, StatusVariantPipe, DatePipe],
  templateUrl: './exam-bank-check-all-matches-page.html',
})
export class ExamBankCheckAllMatchesPage {
  readonly quizId = input<string>();

  readonly #router = inject(Router);
  readonly #location = inject(Location);
  readonly #examService = inject(TeacherExamService);

  protected readonly backAriaLabel = $localize`:Check all matches back button aria label:Back`;
  protected readonly unpublishAriaLabel = $localize`:Check all matches unpublish aria label:Unpublish match`;

  readonly #refresh = signal(0);
  readonly #matchesResource = toSignal(
    toObservable(this.#refresh).pipe(
      switchMap(() => this.#examService.getMatches({ quizId: this.quizId() }))
    ),
    { initialValue: [] }
  );

  readonly matches = computed(() => this.#matchesResource());

  goBack(): void {
    if (window.history.length > 1) {
      this.#location.back();
    } else {
      void this.#router.navigate(['/teacher/exams/bank']);
    }
  }

  unpublishMatch(match: Match): void {
    this.#examService.unpublishMatch(match.id).subscribe({
      next: () => {
        this.#refresh.update(n => n + 1);
      },
    });
  }
}
