import { Component, input } from '@angular/core';
import { Icon, IconName } from '../../atoms/icon/icon';

@Component({
  selector: 'qz-info-card',
  imports: [Icon],
  templateUrl: './info-card.html',
})
export class InfoCard {
  icon = input.required<IconName>();
  title = input.required<string>();
}
