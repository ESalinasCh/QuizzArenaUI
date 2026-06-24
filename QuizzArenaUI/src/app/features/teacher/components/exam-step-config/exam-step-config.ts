import { ChangeDetectionStrategy, Component, computed, output, signal } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Button } from '../../../../shared/atoms/button/button';
import { Icon } from '../../../../shared/atoms/icon/icon';
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
  imports: [ReactiveFormsModule, Button, Icon],
  templateUrl: './exam-step-config.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamStepConfig {
  next = output<ExamConfig>();
  back = output<void>();

  readonly shuffle = signal(false);

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

  readonly dateRangeInvalid = computed(
    () => this.form.hasError('dateRange') && this.form.controls.enabledUntil.touched,
  );

  toggleShuffle(): void {
    this.shuffle.update(v => !v);
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const { durationMinutes, maxRetries, enabledFrom, enabledUntil } = this.form.getRawValue();
    this.next.emit({
      durationMinutes,
      maxRetries,
      shuffle: this.shuffle(),
      enabledFrom,
      enabledUntil,
    });
  }
}
