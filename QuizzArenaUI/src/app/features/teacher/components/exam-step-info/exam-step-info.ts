import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
<<<<<<< HEAD
import { toSignal } from '@angular/core/rxjs-interop';
=======
>>>>>>> 6a36d851 (feat(teacher): add exam creation flow)
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Button } from '../../../../shared/atoms/button/button';
import { ClassSource } from '../../models/exam.model';

export interface ExamInfoData {
  title: string;
  description: string;
  classIds: string[];
}

@Component({
  selector: 'qz-exam-step-info',
  imports: [ReactiveFormsModule, Button],
  templateUrl: './exam-step-info.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamStepInfo {
  classes = input.required<ClassSource[]>();

  next = output<ExamInfoData>();

<<<<<<< HEAD
  readonly nextAriaLabel = $localize`:Exam step info next button aria label:Next`;

=======
>>>>>>> 6a36d851 (feat(teacher): add exam creation flow)
  readonly form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    description: new FormControl('', { nonNullable: true }),
  });

  readonly #selectedClassIds = signal<Set<string>>(new Set());

  readonly #submitted = signal(false);
<<<<<<< HEAD
  readonly #formEvents = toSignal(this.form.events);

  readonly titleInvalid = computed(() => {
    this.#formEvents();
    return this.form.controls.title.invalid && this.form.controls.title.touched;
  });
=======

  readonly titleInvalid = computed(
    () => this.form.controls.title.invalid && this.form.controls.title.touched,
  );
>>>>>>> 6a36d851 (feat(teacher): add exam creation flow)

  readonly noClassesError = computed(
    () => this.#submitted() && this.#selectedClassIds().size === 0,
  );

  toggleClass(id: string): void {
    this.#selectedClassIds.update(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  isClassSelected(id: string): boolean {
    return this.#selectedClassIds().has(id);
  }

  classButtonClass(selected: boolean): string {
    const base = 'flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors';
    return selected
<<<<<<< HEAD

      ? `${base} border-primary bg-primary-light dark:bg-dark-surface-alt`
=======
      ? `${base} border-primary bg-primary-light`
>>>>>>> 6a36d851 (feat(teacher): add exam creation flow)
      : `${base} border-light-border-strong bg-light-surface dark:border-dark-border-strong dark:bg-dark-bg`;
  }

  submit(): void {
    this.form.markAllAsTouched();
    this.#submitted.set(true);
    if (this.form.invalid || this.#selectedClassIds().size === 0) return;

    const { title, description } = this.form.getRawValue();
    this.next.emit({ title, description, classIds: [...this.#selectedClassIds()] });
  }
}
