import { Component, computed, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, ReactiveFormsModule, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Button } from '../../../../shared/atoms/button/button';
=======
import { ChangeDetectionStrategy, Component, computed, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, ReactiveFormsModule, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Button } from '../../../../shared/atoms/button/button';
import { Icon } from '../../../../shared/atoms/icon/icon';
>>>>>>> 6a36d851 (feat(teacher): add exam creation flow)
import { ExamConfig } from '../../models/exam.model';

function dateRangeValidator(group: AbstractControl): ValidationErrors | null {
  const from = group.get('enabledFrom')?.value;
  const until = group.get('enabledUntil')?.value;
  if (from && until && new Date(until) <= new Date(from)) {
    return { dateRange: true };
  }
  return null;
}

@Component({
  selector: 'qz-exam-step-config',
<<<<<<< HEAD
  imports: [ReactiveFormsModule, Button],
=======
  imports: [ReactiveFormsModule, Button, Icon],
>>>>>>> 6a36d851 (feat(teacher): add exam creation flow)
  templateUrl: './exam-step-config.html',
})
export class ExamStepConfig {
  next = output<ExamConfig>();
  back = output<void>();

<<<<<<< HEAD
  readonly shuffleQuestions = signal(false);
  readonly shuffleOptions = signal(false);

  readonly backAriaLabel = $localize`:Exam step config back button aria label:Back`;
  readonly publishAriaLabel = $localize`:Exam step config publish button aria label:Publish exam`;
=======
  readonly shuffle = signal(false);
>>>>>>> 6a36d851 (feat(teacher): add exam creation flow)

  readonly backAriaLabel = $localize`:Exam step config back button aria label:Back`;
  readonly publishAriaLabel = $localize`:Exam step config publish button aria label:Publish exam`;

  readonly backAriaLabel = $localize`:Exam step config back button aria label:Back`;
  readonly publishAriaLabel = $localize`:Exam step config publish button aria label:Publish exam`;

  readonly form = new FormGroup(
    {
      durationMinutes: new FormControl<number>(30, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1), Validators.max(300)],
      }),
      maxRetries: new FormControl<number>(1, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0), Validators.max(10)],
      }),
      enabledFrom: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      enabledUntil: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: dateRangeValidator },
  );

<<<<<<< HEAD
  readonly #formEvents = toSignal(this.form.events);

  readonly dateRangeInvalid = computed(() => {
    this.#formEvents();
    return this.form.hasError('dateRange') && this.form.controls.enabledUntil.touched;
  });

  toggleShuffleQuestions(): void {
    this.shuffleQuestions.update(shuffled => !shuffled);
  }

  toggleShuffleOptions(): void {
    this.shuffleOptions.update(shuffled => !shuffled);
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const { durationMinutes, maxRetries, enabledFrom, enabledUntil } = this.form.getRawValue();
    this.next.emit({
      durationMinutes,
      maxRetries,
<<<<<<< HEAD
      shuffleQuestions: this.shuffleQuestions(),
      shuffleOptions: this.shuffleOptions(),
=======
      shuffle: this.shuffle(),
>>>>>>> 6a36d851 (feat(teacher): add exam creation flow)
      enabledFrom,
      enabledUntil,
    });
  }
}
