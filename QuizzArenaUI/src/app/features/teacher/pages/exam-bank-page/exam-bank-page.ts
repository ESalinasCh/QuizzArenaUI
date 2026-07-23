import { Component, computed, debounced, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { Button } from '../../../../shared/atoms/button/button';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { Exam } from '../../models/exam.model';
import { TextInput } from '../../../../shared/molecules/text-input/text-input';
import { DEFAULT_PAGE_SIZE } from '../../../../core/models/pagination.model';

@Component({
  selector: 'qz-teacher-exam-bank-page',
  imports: [Button, Icon, TextInput],
  templateUrl: './exam-bank-page.html',
})
export class TeacherExamBankPage {
  readonly #router = inject(Router);
  readonly #examService = inject(TeacherExamService);

  readonly searchQuery = signal('');
  readonly debouncedSearchQuery = debounced(this.searchQuery, 300);
  readonly limit = signal(DEFAULT_PAGE_SIZE);

  protected readonly createExamAriaLabel = $localize`:Exam bank create exam button aria label:Create exam`;
  protected readonly publishAriaLabel = $localize`:Exam bank publish button aria label:Publish exam`;

  readonly examsResource = rxResource({
    params: () => ({
      search: this.debouncedSearchQuery.value() ?? '',
      limit: this.limit(),
    }),
    stream: ({ params }) =>
      this.#examService.getExams({ page: 1, pageSize: params.limit, search: params.search, status: 'draft' }),
  });

  readonly draftExams = computed(() => this.examsResource.value() ?? []);
  readonly visibleExams = this.draftExams;

  readonly hasMoreExams = computed(() => this.draftExams().length >= this.limit());

  loadMore(): void {
    this.limit.update(l => l + DEFAULT_PAGE_SIZE);
  }

  async createExam(): Promise<void> {
    await this.#router.navigate(['/teacher/exams/create']);
  }

  publishExam(exam: Exam): void {
    void this.#router.navigate(['/teacher/exams/publish'], {
      state: {
        title: exam.title,
        description: exam.description,
        classIds: [],
        questionIds: exam.questionIds,
        from: 'bank',
      },
    });
  }
}
