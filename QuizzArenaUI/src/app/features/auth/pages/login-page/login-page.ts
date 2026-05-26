import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Button } from '../../../../shared/atoms/button/button';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [Button, Icon],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  readonly #authService = inject(AuthService);

  signIn(): void {
    this.#authService.login();
  }

  register(): void {
    this.#authService.register();
  }
}
