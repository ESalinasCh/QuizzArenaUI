import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { Button } from '../../../../shared/atoms/button/button';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { Exam } from '../../models/exam.model';

@Component({
  selector: 'qz-teacher-exam-bank-page',
  imports: [Button, Icon],
  templateUrl: './exam-bank-page.html',
})
export class TeacherExamBankPage {
  readonly #router = inject(Router);
  readonly #examService = inject(TeacherExamService);

  protected readonly createExamAriaLabel = $localize`:Exam bank create exam button aria label:Create exam`;
  protected readonly publishAriaLabel = $localize`:Exam bank publish button aria label:Publish exam`;

  readonly #allExams = toSignal(this.#examService.getExams(), { initialValue: [] });

  readonly draftExams = computed(() => this.#allExams().filter(e => e.status === 'draft'));

  async createExam(): Promise<void> {
    await this.#router.navigate(['/teacher/exams/create']);
  }

  publishExam(exam: Exam): void {
    void this.#router.navigate(['/teacher/exams/publish', exam.id]);
  }
}
