import { Component, debounced, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { Button } from '../../../../shared/atoms/button/button';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { DEFAULT_PAGE_SIZE } from '../../../../core/models/pagination.model';
import { ItemContainer } from "../../../../shared/atoms/item-container/item-container";
import { ExamBankItem } from '../../components/exam-bank-item/exam-bank-item';
import { QuizResponseAsExams } from '../../api/teacher-exam.contract';
@Component({
  selector: 'qz-teacher-exam-bank-page',
  imports: [Button, Icon, ItemContainer, ExamBankItem, MatchesForQuizPipe],
  templateUrl: './exam-bank-page.html',
})
export class TeacherExamBankPage {
  readonly #router = inject(Router);
  readonly #examService = inject(TeacherExamService);

  readonly searchQuery = signal('');
  readonly debouncedSearchQuery = debounced(this.searchQuery, 300);
  readonly limit = signal(DEFAULT_PAGE_SIZE);

  protected readonly createExamAriaLabel = $localize`:Exam bank create exam button aria label:Create exam`;

  // readonly #allExams = toSignal(this.#examService.getExams(), { initialValue: [] });
  // readonly #allExams = toSignal(this.#examService.getQuizzesAsExams(), { initialValue: [] });
  // readonly #allMatches = toSignal(this.#examService.getMatches(), { initialValue: [] });
  readonly quizzesResource = rxResource({
    params: () => ({
      search: this.debouncedSearchQuery.value() ?? '',
      limit: this.limit(),
    }),
    stream: ({ params }) =>
      this.#examService.getQuizzesAsExams({ page: 1, pageSize: params.limit, search: params.search, status: 'draft' }),
  });

  loadMore(): void {
    this.limit.update(l => l + DEFAULT_PAGE_SIZE);
  }

  async createExam(): Promise<void> {
    await this.#router.navigate(['/teacher/exams/create']);
  }

  publishExam(exam: QuizResponseAsExams): void {
    void this.#router.navigate(['/teacher/exams/publish', exam.id]);
  }

  unpublishMatch(match: Match): void {
    this.#examService.unpublishMatch(match.id).subscribe({
      next: () => {
        this.#refreshMatches.update(n => n + 1);
      },
    });
  }
}
