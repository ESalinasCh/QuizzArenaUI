import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [NgClass],
  templateUrl: './badge.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Badge {
  label = input.required<string>();
  variant = input<BadgeVariant>('info');

  badgeClasses = computed(() => [
    this.baseClasses,
    this.variantClasses[this.variant()],
  ]);

  private readonly baseClasses =
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

  private readonly variantClasses: Record<BadgeVariant, string> = {
    success:
      'bg-success-bg-light text-success-text-light dark:bg-success-bg-dark dark:text-success-text-dark',
    warning:
      'bg-warning-bg-light text-warning-text-light dark:bg-warning-bg-dark dark:text-warning-text-dark',
    danger:
      'bg-danger-bg-light text-danger-text-light dark:bg-danger-bg-dark dark:text-danger-text-dark',
    info:
      'bg-info-bg-light text-info dark:bg-info-bg-dark dark:text-white',
  };
}
