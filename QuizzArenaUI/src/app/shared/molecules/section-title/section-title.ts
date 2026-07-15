import { Component, input } from '@angular/core';
import { Icon, IconName } from '../../atoms/icon/icon';

@Component({
  selector: 'qz-section-title',
  imports: [Icon],
  templateUrl: './section-title.html',
})
export class SectionTitle {
  title = input.required<string>();
  icon = input.required<IconName>();
}
