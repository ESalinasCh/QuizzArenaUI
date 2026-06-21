import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type StatCardVariant = 'success' | 'danger' | 'blue' | 'green';

@Component({
  selector: 'qz-stat-card',
  standalone: true,
  imports: [],
  templateUrl: './stat-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCard {
  readonly label = input.required<string>();
  readonly value = input.required<number | string>();
  readonly variant = input<StatCardVariant>('blue');

  protected readonly containerClasses = computed(() => [
    'flex flex-col items-center justify-center gap-1 rounded-2xl px-6 py-5 flex-1',
    this.variantClasses[this.variant()].container,
  ]);

  protected readonly labelClasses = computed(() => [
    'text-sm font-medium',
    this.variantClasses[this.variant()].label,
  ]);

  protected readonly valueClasses = computed(() => [
    'text-3xl font-extrabold',
    this.variantClasses[this.variant()].value,
  ]);

  private readonly variantClasses: Record<
    StatCardVariant,
    { container: string; label: string; value: string }
  > = {
    blue: {
      container: 'bg-primary-soft dark:bg-info-bg-dark',
      label: 'text-info dark:text-blue-300',
      value: 'text-blue-900 dark:text-white',
    },
    green: {
      container: 'bg-secondary-light dark:bg-success-bg-dark',
      label: 'text-secondary-hover dark:text-success-text-dark',
      value: 'text-green-900 dark:text-white',
    },
    success: {
      container: 'bg-success-bg-light dark:bg-success-bg-dark',
      label: 'text-success-text-light dark:text-success-text-dark',
      value: 'text-green-900 dark:text-white',
    },
    danger: {
      container: 'bg-danger-bg-light dark:bg-danger-bg-dark',
      label: 'text-danger-text-light dark:text-danger-text-dark',
      value: 'text-red-900 dark:text-white',
    },
  };
}
