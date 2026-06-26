import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { Icon } from '../../atoms/icon/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'qz-user-menu',
  imports: [Icon],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenu {
  readonly #authService = inject(AuthService);

  readonly currentUser = this.#authService.currentUser;
  readonly isOpened = signal(false);

  toggle(): void {
    this.isOpened.update((v) => !v);
  }

  logout(): void {
    this.isOpened.set(false);
    this.#authService.logout();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.isOpened.set(false);
  }
}
