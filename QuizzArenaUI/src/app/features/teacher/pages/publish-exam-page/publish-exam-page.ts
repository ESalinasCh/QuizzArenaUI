import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { ExamStepConfig } from '../../components/exam-step-config/exam-step-config';
import { ExamConfig, ExamOrigin } from '../../models/exam.model';

interface PendingExamState {
  title: string;
  description: string;
  classIds: string[];
  questionIds: string[];
  from?: 'create' | 'bank' | 'dashboard';
}

@Component({
  selector: 'qz-teacher-publish-exam-page',
  imports: [ExamStepConfig],
  templateUrl: './publish-exam-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherPublishExamPage {
  readonly #router = inject(Router);
  readonly #examService = inject(TeacherExamService);

  protected readonly backAriaLabel = $localize`:Publish exam page back button aria label:Back`;

  goBack(): void {
    const from = (history.state as PendingExamState)?.from;
    const route =
      from === 'bank'
        ? '/teacher/exams/bank'
        : from === 'dashboard'
          ? '/teacher/dashboard'
          : '/teacher/exams/create';
    void this.#router.navigate([route]);
  }

  onPublish(config: ExamConfig): void {
    const state = history.state as PendingExamState;
    if (!state?.title) return;

    const origin: ExamOrigin = 'manually_created';
    this.#examService
      .createExam({
        title: state.title,
        description: state.description,
        origin,
        questionIds: state.questionIds,
        config,
      })
      .subscribe(() => {
        void this.#router.navigate(['/teacher/dashboard']);
      });
  }
}
