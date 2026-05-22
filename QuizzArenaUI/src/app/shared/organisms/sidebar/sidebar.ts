import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { NavItem } from '../../molecules/nav-item/nav-item';
import { Icon } from '../../atoms/icon/icon';
import { Button } from '../../atoms/button/button';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass, NavItem, Icon, Button],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  readonly #themeService = inject(ThemeService);

  isOpen = input<boolean>(false);
  closeSidebar = output<void>();
  currentTheme = this.#themeService.currentTheme;

  onCloseClick(): void {
    this.closeSidebar.emit();
  }

  toggleTheme(): void {
    this.#themeService.toggleTheme();
  }
}
