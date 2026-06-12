import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-role-redirect-page',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleRedirectPage implements OnInit {
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);

  ngOnInit(): void {
    void this.#router.navigateByUrl(this.#authService.getDefaultRoute());
  }
}
