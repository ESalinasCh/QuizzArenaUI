import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { NavItem } from '../../molecules/nav-item/nav-item';
import { Icon } from '../../atoms/icon/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass, NavItem, Icon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {

  isOpen = input<boolean>(false);
  closeSidebar = output<void>();

  onCloseClick(): void {
    this.closeSidebar.emit();
  }
}
