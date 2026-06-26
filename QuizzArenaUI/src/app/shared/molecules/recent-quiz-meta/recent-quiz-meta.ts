import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Icon, IconName } from '../../atoms/icon/icon';

export type RecentQuizMetaStatus = 'passed' | 'warning';

@Component({
  selector: 'qz-recent-quiz-meta',
  standalone: true,
  imports: [Icon],
  templateUrl: './recent-quiz-meta.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentQuizMeta {
  score = input.required<number>();
  completedAtLabel = input.required<string>();
  status = input<RecentQuizMetaStatus>('warning');

  readonly iconName = computed<IconName>(() => (this.status() === 'passed' ? 'check' : 'warning'));

  readonly metaClasses = computed(() =>
    this.status() === 'passed'
      ? 'text-success-text-light dark:text-success-text-dark'
      : 'text-warning-text-light dark:text-warning-text-dark',
  );
}
