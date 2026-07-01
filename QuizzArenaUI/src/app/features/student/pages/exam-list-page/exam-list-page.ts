import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../core/services/auth.service';
import { SectionTitle } from '../../../../shared/molecules/section-title/section-title';
import { AvailableQuizCard } from '../../components/available-quiz-card/available-quiz-card';
import { StudentQuizService } from '../../services/student-quiz.service';
import { MatchFilters, MatchStatus } from '../../api/student-quiz.contract';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { FilterTabs } from '../../components/filter-tabs/filter-tabs';

@Component({
  selector: 'qz-student-exam-list-page',
  imports: [AvailableQuizCard, SectionTitle, FilterTabs],
  templateUrl: './exam-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentExamListPage {
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);
  readonly #studentQuizService = inject(StudentQuizService);
  protected readonly matchStatus = MatchStatus;
  protected readonly statusOptions = [
    {
      label: 'Pending',
      value: MatchStatus.Pending,
    },
    {
      label: 'Active',
      value: MatchStatus.Active,
    },
  ];

  readonly filters = signal<MatchFilters>({
    status: MatchStatus.Pending,
  });
  
  readonly availableExamsTitle = $localize`:Student available exams section title:Available Exams`;
  readonly recentExamsTitle = $localize`:Student recent exams section title:Recent Exams`;
  readonly studentFallbackName = $localize`:Student fallback display name:Student`;

  // readonly exams = toSignal(this.#studentQuizService.getExams(this.filters()));
  readonly exams = toSignal(
    toObservable(this.filters).pipe(
      switchMap(filters => this.#studentQuizService.getExams(filters))
    ),
    { initialValue: [] }
  );

  async startQuiz(quizId: string): Promise<void> {
    await this.#router.navigate(['/student/quizzes', quizId, 'start']);
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
