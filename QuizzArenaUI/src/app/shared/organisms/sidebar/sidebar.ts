import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { NavItem } from '../../molecules/nav-item/nav-item';
import { Icon } from '../../atoms/icon/icon';
import { Button } from '../../atoms/button/button';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';

interface SidebarNavItem {
  label: string;
  icon: 'dashboard' | 'quiz' | 'settings';
  routerLink: string;
  roles: string[];
}

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
  readonly #authService = inject(AuthService);

  isOpen = input<boolean>(false);
  closeSidebar = output<void>();
  currentTheme = this.#themeService.currentTheme;

  readonly navItems: SidebarNavItem[] = [
    {
      label: 'Quizzes',
      icon: 'quiz',
      routerLink: '/student/quizzes',
      roles: ['student'],
    },
    {
      label: 'Dashboard',
      icon: 'dashboard',
      routerLink: '/teacher/dashboard',
      roles: ['teacher'],
    },
    {
      label: 'Cuestionarios',
      icon: 'quiz',
      routerLink: '/teacher/quizzes',
      roles: ['teacher'],
    },
  ];

  canShowItem(item: SidebarNavItem): boolean {
    return item.roles.some(role => this.#authService.hasRole(role));
  }

  onCloseClick(): void {
    this.closeSidebar.emit();
  }

  toggleTheme(): void {
    this.#themeService.toggleTheme();
  }
}
