import { Component, computed, input } from '@angular/core';
import { SVG_ICONS } from './icons.constants';

export type IconName = keyof typeof SVG_ICONS;

@Component({
  selector: 'qz-icon',
  templateUrl: './icon.html',
  styleUrl: './icon.css',

})
export class Icon {
  name = input.required<IconName>();
  path = computed(() => SVG_ICONS[this.name()]);
}

