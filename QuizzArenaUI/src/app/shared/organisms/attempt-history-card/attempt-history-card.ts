import { Component, computed, input, output } from '@angular/core';
import { StatusLabel, StatusLabelVariant } from '../../atoms/status-label/status-label';

@Component({
  selector: 'qz-attempt-history-card',
  imports: [StatusLabel],
  templateUrl: './attempt-history-card.html',
})
export class AttemptHistoryCard {
  title = input.required<string>();
  subtitle = input.required<string>();
  completedAtLabel = input.required<string>();
  durationLabel = input.required<string>();
  scoreLabel = input.required<string>();
  statusLabel = input.required<string>();
  statusVariant = input.required<StatusLabelVariant>();
  actionLabel = input.required<string>();

  actionClick = output<void>();

  readonly statusBadgeClasses = computed(() => this.#statusBadgeClasses[this.statusVariant()]);

  readonly #statusBadgeClasses: Record<StatusLabelVariant, string> = {
    success: 'bg-success-bg-light dark:bg-success-bg-dark',
    info: 'bg-primary-light dark:bg-dark-surface',
    warning: 'bg-warning-bg-light dark:bg-warning-bg-dark',
    danger: 'bg-danger-bg-light dark:bg-danger-bg-dark',
  };
}
