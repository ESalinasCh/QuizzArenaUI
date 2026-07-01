import { ChangeDetectionStrategy, Component, inject, resource, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SectionTitle } from '../../../../shared/molecules/section-title/section-title';
import { AvailableQuizCard } from '../../components/available-quiz-card/available-quiz-card';
import { StudentQuizService } from '../../services/student-quiz.service';
import { MatchFilters, MatchStatus } from '../../api/student-quiz.contract';
import { FilterTabs } from '../../components/filter-tabs/filter-tabs';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { FilterStatusOption } from '../../models/student-quiz.model';

@Component({
  selector: 'qz-student-exam-list-page',
  imports: [AvailableQuizCard, SectionTitle, FilterTabs],
  templateUrl: './exam-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  });
  
  readonly availableExamsTitle = $localize`:Student available exams section title:Available Exams`;
  readonly recentExamsTitle = $localize`:Student recent exams section title:Recent Exams`;
  readonly studentFallbackName = $localize`:Student fallback display name:Student`;
  readonly noExamsMessage = $localize`:Student no exams message:You don't have any exams.`;

  readonly exams = resource({
    params: () => this.filters(),
    loader: ({params: filters}) => firstValueFrom(this.#studentQuizService.getMatches(filters)),
  })

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
