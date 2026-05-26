import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { Icon } from '../../atoms/icon/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [Icon],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenu {
  readonly #authService = inject(AuthService);

  readonly currentUser = this.#authService.currentUser;
  readonly isOpen = signal(false);

  toggle(): void {
    this.isOpen.update(v => !v);
  }

  logout(): void {
    this.isOpen.set(false);
    this.#authService.logout();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.isOpen.set(false);
  }
}
