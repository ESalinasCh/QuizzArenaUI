import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { NavItem } from '../../molecules/nav-item/nav-item';
import { Icon, IconName } from '../../atoms/icon/icon';
import { Button } from '../../atoms/button/button';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';

interface SidebarNavItem {
  label: string;
  icon: IconName;
  routerLink: string;
  roles: string[];
}

@Component({
  selector: 'qz-sidebar',
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

  protected readonly lightModeLabel = $localize`:Aria label to switch to light mode:Switch to light mode`;
  protected readonly darkModeLabel = $localize`:Aria label to switch to dark mode:Switch to dark mode`;

  readonly navItems: SidebarNavItem[] = [
    {
      label: $localize`:Sidebar nav student quizzes label:Quizzes`,
      icon: 'quiz',
      routerLink: '/student/quizzes',
      roles: ['student'],
    },
    {
      label: $localize`:Sidebar nav teacher dashboard label:Dashboard`,
      icon: 'dashboard',
      routerLink: '/teacher/dashboard',
      roles: ['teacher'],
    },
    {
      label: $localize`:Sidebar nav teacher quizzes label:Quizzes`,
      icon: 'quiz',
      routerLink: '/teacher/quizzes',
      roles: ['teacher'],
    },
    {
      label: $localize`:Sidebar nav teacher exam bank label:Exam Bank`,
      icon: 'chart-bar',
      routerLink: '/teacher/exams/bank',
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
