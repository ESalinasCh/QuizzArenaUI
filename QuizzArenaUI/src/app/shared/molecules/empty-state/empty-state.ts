import { Component, input } from '@angular/core';
import { Icon, IconName } from '../../atoms/icon/icon';

@Component({
  selector: 'qz-empty-state',
  imports: [Icon],
  templateUrl: './empty-state.html',
})
export class EmptyState {
  icon = input.required<IconName>();
  title = input.required<string>();
  description = input.required<string>();
}
