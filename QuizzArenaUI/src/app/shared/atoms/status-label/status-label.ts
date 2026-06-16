import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type StatusLabelVariant = 'success' | 'info' | 'warning' | 'danger';

@Component({
  selector: 'qz-status-label',
  standalone: true,
  templateUrl: './status-label.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusLabel {
  label = input.required<string>();
  variant = input<StatusLabelVariant>('info');

  readonly labelClasses = computed(() => this.#variantClasses[this.variant()]);

  readonly #variantClasses: Record<StatusLabelVariant, string> = {
    success: 'text-success-text-light dark:text-success-text-dark',
    info: 'text-primary',
    warning: 'text-warning-text-light dark:text-warning-text-dark',
    danger: 'text-danger-text-light dark:text-danger-text-dark',
  };
}
