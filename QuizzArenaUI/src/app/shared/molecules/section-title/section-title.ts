import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon, IconName } from '../../atoms/icon/icon';

@Component({
  selector: 'qz-section-title',
  standalone: true,
  imports: [Icon],
  templateUrl: './section-title.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionTitle {
  title = input.required<string>();
  icon = input.required<IconName>();
}
