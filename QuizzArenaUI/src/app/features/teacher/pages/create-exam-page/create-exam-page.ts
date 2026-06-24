import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { ExamStepInfo, ExamInfoData } from '../../components/exam-step-info/exam-step-info';
import { ExamStepQuestions } from '../../components/exam-step-questions/exam-step-questions';
import { ExamStepConfig } from '../../components/exam-step-config/exam-step-config';
import { ExamConfig } from '../../models/exam.model';

type Step = 1 | 2 | 3;

@Component({
  selector: 'app-teacher-create-exam-page',
  imports: [ExamStepInfo, ExamStepQuestions, ExamStepConfig],
  templateUrl: './create-exam-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherCreateExamPage {
  readonly #router = inject(Router);
  readonly #examService = inject(TeacherExamService);

  readonly currentStep = signal<Step>(1);

  readonly #examInfo = signal<ExamInfoData | null>(null);
  readonly #selectedQuestionIds = signal<Set<string>>(new Set());

  readonly #allClasses = toSignal(this.#examService.getClasses(), { initialValue: [] });
  readonly #allQuestions = toSignal(this.#examService.getQuestions(), { initialValue: [] });

  readonly classes = this.#allClasses;

  readonly filteredQuestions = computed(() => {
    const info = this.#examInfo();
    if (!info) return [];
    return this.#allQuestions().filter(q => info.classIds.includes(q.sourceId));
  });

  onInfoNext(data: ExamInfoData): void {
    this.#examInfo.set(data);
    this.currentStep.set(2);
  }

  onQuestionsNext(selectedIds: Set<string>): void {
    this.#selectedQuestionIds.set(selectedIds);
    this.currentStep.set(3);
  }

  onConfigNext(config: ExamConfig): void {
    const info = this.#examInfo();
    if (!info) return;

    this.#examService
      .createExam({
        title: info.title,
        description: info.description,
        questionIds: [...this.#selectedQuestionIds()],
        config,
      })
      .subscribe(() => {
        void this.#router.navigate(['/teacher/dashboard']);
      });
  }

  goBack(): void {
    const step = this.currentStep();
    if (step === 1) {
      void this.#router.navigate(['/teacher/dashboard']);
    } else {
      this.currentStep.set((step - 1) as Step);
    }
  }
}
