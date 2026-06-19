import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon, IconName } from '../icon/icon';

@Component({
  selector: 'qz-meta-text',
  standalone: true,
  imports: [Icon],
  templateUrl: './meta-text.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetaText {
  text = input.required<string>();
  icon = input<IconName | null>(null);
}
