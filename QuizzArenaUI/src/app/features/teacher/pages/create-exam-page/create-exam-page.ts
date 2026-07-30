import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { rxResource, takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, of } from 'rxjs';
import { TeacherExamService } from '../../services/teacher-exam.service';
import { ClassSourcesService } from '../../services/class-sources.service';
import { ExamStepInfo, ExamInfoData } from '../../components/exam-step-info/exam-step-info';
import { ExamStepQuestions } from '../../components/exam-step-questions/exam-step-questions';
import { Question } from '../../models/exam.model';
import { NavigationHistoryService } from '../../../../core/services/navigation-history.service';

type Step = 1 | 2;

@Component({
  selector: 'app-teacher-create-exam-page',
  imports: [ExamStepInfo, ExamStepQuestions],
  templateUrl: './create-exam-page.html',
})
export class TeacherCreateExamPage {
  readonly #router = inject(Router);
  readonly #examService = inject(TeacherExamService);
  readonly #classSourcesService = inject(ClassSourcesService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #navigationHistoryService = inject(NavigationHistoryService);

  readonly currentStep = signal<Step>(1);

  readonly #examInfo = signal<ExamInfoData | null>(null);
  readonly #selectedClassIds = signal<string[]>([]);

  readonly #classSources = toSignal(this.#classSourcesService.getClassSources(), { initialValue: [] });

  readonly classes = computed(() => this.#classSources().map(({ id, name }) => ({ id, name })));

  readonly questionsResource = rxResource<Question[], { processingJobIds: string[] }>({
    params: () => {
      const selectedIds = new Set(this.#selectedClassIds());
      const processingJobIds = this.#classSources()
        .filter(source => selectedIds.has(source.id))
        .flatMap(source => source.processingJobsIds);
      return { processingJobIds };
    },
    stream: ({ params }) => {
      if (params.processingJobIds.length === 0) return of([]);
      return this.#examService.getQuestions(params.processingJobIds).pipe(catchError(() => of([])));
    }
  });

  readonly filteredQuestions = computed(() =>
    this.questionsResource.hasValue() ? this.questionsResource.value() : [],
  );

  onInfoNext(data: ExamInfoData): void {
    this.#examInfo.set(data);
    this.#selectedClassIds.set(data.classIds);
    this.currentStep.set(2);
  }

  onQuestionsPublish(selectedIds: Set<string>): void {
    const info = this.#examInfo();
    if (!info) return;
    this.#examService
      .saveDraftExam(info.title, info.description, [...selectedIds])
      .pipe(
        catchError(() => EMPTY),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(exam =>
        void this.#router.navigate(['/teacher/exams/publish', exam.id]),
      );
  }

  onQuestionsSaveToBank(selectedIds: Set<string>): void {
    const info = this.#examInfo();
    if (!info) return;
    this.#examService
      .saveDraftExam(info.title, info.description, [...selectedIds])
      .pipe(
        catchError(() => EMPTY),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(() => void this.#router.navigate(['/teacher/exams/bank']));
  }

  goBack(): void {
    this.#navigationHistoryService.back('/teacher/exams/bank');
  }
}
