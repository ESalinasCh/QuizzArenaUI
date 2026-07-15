import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Icon, IconName } from '../../atoms/icon/icon';

@Component({
  selector: 'qz-nav-item',
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './nav-item.html',
  styleUrl: './nav-item.css',
})
export class NavItem {
  label = input.required<string>();
  icon = input.required<IconName>();
  routerLink = input.required<string>();
}
