import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Icon, IconName } from '../../atoms/icon/icon';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass, Icon],
  templateUrl: './nav-item.html',
  styleUrl: './nav-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavItem {
  label = input.required<string>();
  icon = input.required<IconName>();
  routerLink = input.required<string>();
}
