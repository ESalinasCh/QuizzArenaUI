import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { Button } from '../../../../shared/atoms/button/button';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { Exam } from '../../models/exam.model';
import { TextInput } from '../../../../shared/molecules/text-input/text-input';
import { debounceTime, switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
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
  readonly limit = signal(DEFAULT_PAGE_SIZE);

  protected readonly createExamAriaLabel = $localize`:Exam bank create exam button aria label:Create exam`;
  protected readonly publishAriaLabel = $localize`:Exam bank publish button aria label:Publish exam`;

  readonly visibleExams = toSignal(
    combineLatest([
      toObservable(this.searchQuery).pipe(debounceTime(300)),
      toObservable(this.limit)
    ]).pipe(
      switchMap(([search, limit]) => 
        this.#examService.getExams({ page: 1, pageSize: limit, search, status: 'draft' })
      )
    ),
    { initialValue: [] }
  );

  readonly draftExams = this.visibleExams;

  readonly hasMoreExams = computed(() => {
    // If we received exactly the amount requested, assume there could be more
    return this.visibleExams().length >= this.limit();
  });

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
