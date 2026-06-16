import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type StatCardVariant = 'success' | 'danger';

@Component({
  selector: 'qz-stat-card',
  standalone: true,
  templateUrl: './stat-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCard {
  label = input.required<string>();
  value = input.required<number | string>();
  variant = input<StatCardVariant>('success');

  readonly cardClasses = computed(() =>
    this.variant() === 'success'
      ? 'bg-success-bg-light text-success-text-light dark:bg-success-bg-dark dark:text-success-text-dark'
      : 'bg-danger-bg-light text-danger-text-light dark:bg-danger-bg-dark dark:text-danger-text-dark',
  );
}
