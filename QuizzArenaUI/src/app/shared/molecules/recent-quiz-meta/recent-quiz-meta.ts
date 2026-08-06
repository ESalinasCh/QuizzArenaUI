import { Component, computed, input } from '@angular/core';
import { Icon, IconName } from '../../atoms/icon/icon';

export type RecentQuizMetaStatus = 'completed' | 'warning';

@Component({
  selector: 'qz-recent-quiz-meta',
  imports: [Icon],
  templateUrl: './recent-quiz-meta.html',
})
export class RecentQuizMeta {
  score = input.required<number>();
  completedAtLabel = input.required<string>();
  status = input<RecentQuizMetaStatus>('warning');

  readonly iconName = computed<IconName>(() =>
    this.status() === 'completed' ? 'check' : 'warning',
  );

  readonly metaClasses = computed(() =>
    this.score() >= 51
      ? 'text-success-text-light dark:text-success-text-dark'
      : 'text-warning-text-light dark:text-warning-text-dark',
  );
}
