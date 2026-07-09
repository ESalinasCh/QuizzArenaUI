import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { ExamStepInfo, ExamInfoData } from '../../components/exam-step-info/exam-step-info';
import { ExamStepQuestions } from '../../components/exam-step-questions/exam-step-questions';

type Step = 1 | 2;

@Component({
  selector: 'app-teacher-create-exam-page',
  imports: [ExamStepInfo, ExamStepQuestions],
  templateUrl: './create-exam-page.html',
})
export class TeacherCreateExamPage {
  readonly #router = inject(Router);
  readonly #examService = inject(TeacherExamService);
  readonly #destroyRef = inject(DestroyRef);

  readonly currentStep = signal<Step>(1);

  readonly #examInfo = signal<ExamInfoData | null>(null);

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

  onQuestionsPublish(selectedIds: Set<string>): void {
    const info = this.#examInfo();
    if (!info) return;
    void this.#router.navigate(['/teacher/exams/publish'], {
      state: {
        title: info.title,
        description: info.description,
        classIds: info.classIds,
        questionIds: [...selectedIds],
        from: 'create',
      },
    });
  }

  onQuestionsSaveToBank(selectedIds: Set<string>): void {
    const info = this.#examInfo();
    if (!info) return;
    this.#examService
      .saveDraftExam(info.title, info.description, [...selectedIds])
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => void this.#router.navigate(['/teacher/exams/bank']));
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
