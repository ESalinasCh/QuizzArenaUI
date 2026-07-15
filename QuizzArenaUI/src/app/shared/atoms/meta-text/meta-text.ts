import { Component, input } from '@angular/core';
import { Icon, IconName } from '../icon/icon';

@Component({
  selector: 'qz-meta-text',

  imports: [Icon],
  templateUrl: './meta-text.html',
})
export class MetaText {
  text = input.required<string>();
  icon = input<IconName | null>(null);
}
